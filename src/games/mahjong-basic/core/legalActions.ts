import { isWinningHand } from './handSolver';
import type { MahjongLegalAction, MahjongReaction, MahjongSeat, MahjongState, MahjongTileInstance } from './mahjongTypes';
import { getNextSeat, parseSuitedTile } from './tiles';

export function findChiOptions(hand: readonly MahjongTileInstance[], discard: MahjongTileInstance): number[][] {
  const target = parseSuitedTile(discard.tileType);
  if (!target) return [];
  const options: number[][] = [];
  const patterns = [[-2, -1], [-1, 1], [1, 2]];
  for (const offsets of patterns) {
    const ranks = offsets.map((offset) => target.rank + offset);
    if (ranks.some((rank) => rank < 1 || rank > 9)) continue;
    const selected: MahjongTileInstance[] = [];
    for (const rank of ranks) {
      const tile = hand.find((candidate) => candidate.tileType === `${target.suit}-${rank}` && !selected.some((item) => item.tileId === candidate.tileId));
      if (!tile) break;
      selected.push(tile);
    }
    if (selected.length === 2) options.push(selected.map((tile) => tile.tileId));
  }
  return options;
}

export function buildReactionQueue(state: MahjongState): MahjongReaction[] {
  const discard = state.lastDiscard;
  if (!discard) return [];
  const orderedSeats = [1, 2, 3].map((distance) => getNextSeat(discard.seat, distance));
  const hu = orderedSeats.filter((seat) => {
    const player = state.players[seat];
    return isWinningHand([...player.concealedTiles, discard.tile], player.melds.length);
  }).map((seat): MahjongReaction => ({ seat, type: 'hu' }));
  const pung = orderedSeats.filter((seat) => state.players[seat].concealedTiles.filter((tile) => tile.tileType === discard.tile.tileType).length >= 2)
    .map((seat): MahjongReaction => ({ seat, type: 'pung' }));
  const nextSeat = getNextSeat(discard.seat);
  const chiOptions = findChiOptions(state.players[nextSeat].concealedTiles, discard.tile);
  const chi: MahjongReaction[] = chiOptions.length ? [{ seat: nextSeat, type: 'chi', chiOptions }] : [];
  return [...hu, ...pung, ...chi];
}

export function getLegalActions(state: MahjongState, seat: MahjongSeat): MahjongLegalAction[] {
  if (state.phase === 'ended' || state.status !== 'playing') return [];
  if (state.phase === 'awaiting-discard') {
    if (state.currentSeat !== seat) return [];
    const player = state.players[seat];
    const actions: MahjongLegalAction[] = [{ type: 'discard-tile' }];
    if (isWinningHand(player.concealedTiles, player.melds.length)) actions.unshift({ type: 'declare-hu', winType: 'self-draw' });
    return actions;
  }
  const reaction = state.reactionState?.queue[0];
  if (!reaction || reaction.seat !== seat) return [];
  const actions: MahjongLegalAction[] = [{ type: 'pass-reaction' }];
  if (reaction.type === 'hu') actions.unshift({ type: 'declare-hu', winType: 'discard-win' });
  if (reaction.type === 'pung') actions.unshift({ type: 'claim-pung' });
  if (reaction.type === 'chi') actions.unshift(...(reaction.chiOptions ?? []).map((tileIds) => ({ type: 'claim-chi' as const, tileIds })));
  return actions;
}
