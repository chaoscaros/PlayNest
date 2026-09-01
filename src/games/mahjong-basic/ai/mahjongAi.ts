import { getLegalActions, parseSuitedTile } from '../core';
import type { MahjongAction, MahjongSeat, MahjongState, MahjongTileInstance } from '../core';

export const HUMAN_SEAT: MahjongSeat = 'east';
export const AI_SEATS: readonly MahjongSeat[] = ['south', 'west', 'north'];

export function getMahjongActingSeat(state: MahjongState): MahjongSeat {
  return state.phase === 'awaiting-reaction'
    ? state.reactionState?.queue[0]?.seat ?? state.currentSeat
    : state.currentSeat;
}

function tileUtility(tile: MahjongTileInstance, hand: readonly MahjongTileInstance[]): number {
  const sameTypeCount = hand.filter((candidate) => candidate.tileType === tile.tileType).length;
  const suited = parseSuitedTile(tile.tileType);
  if (!suited) return (sameTypeCount - 1) * 5;

  let utility = 1 + (sameTypeCount - 1) * 5;
  for (const candidate of hand) {
    if (candidate.tileId === tile.tileId) continue;
    const neighbor = parseSuitedTile(candidate.tileType);
    if (!neighbor || neighbor.suit !== suited.suit) continue;
    const distance = Math.abs(neighbor.rank - suited.rank);
    if (distance === 1) utility += 3;
    if (distance === 2) utility += 1;
  }
  return utility;
}

export function chooseMahjongAiDiscard(hand: readonly MahjongTileInstance[]): MahjongTileInstance | null {
  return hand.reduce<MahjongTileInstance | null>((choice, tile) => {
    if (!choice) return tile;
    const score = tileUtility(tile, hand);
    const choiceScore = tileUtility(choice, hand);
    if (score !== choiceScore) return score < choiceScore ? tile : choice;
    return tile.tileId < choice.tileId ? tile : choice;
  }, null);
}

export function chooseMahjongAiAction(state: MahjongState, seat: MahjongSeat): MahjongAction | null {
  const legalActions = getLegalActions(state, seat);
  if (legalActions.length === 0) return null;

  const hu = legalActions.find((action) => action.type === 'declare-hu');
  if (hu) return { type: 'declare-hu', seat };
  if (legalActions.some((action) => action.type === 'claim-pung')) return { type: 'claim-pung', seat };
  const chi = legalActions.find((action) => action.type === 'claim-chi');
  if (chi?.type === 'claim-chi') return { type: 'claim-chi', seat, tileIds: chi.tileIds };
  if (legalActions.some((action) => action.type === 'pass-reaction')) return { type: 'pass-reaction', seat };

  const discard = chooseMahjongAiDiscard(state.players[seat].concealedTiles);
  return discard ? { type: 'discard-tile', seat, tileId: discard.tileId } : null;
}
