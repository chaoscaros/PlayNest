import { isWinningHand } from './handSolver';
import type { MahjongLegalAction, MahjongReaction, MahjongSeat, MahjongState, MahjongTileInstance } from './mahjongTypes';
import { getNextSeat, parseSuitedTile } from './tiles';

function findConcealedKongs(hand: readonly MahjongTileInstance[]): Extract<MahjongLegalAction, { type: 'declare-concealed-kong' }>[] {
  const byType = new Map<MahjongTileInstance['tileType'], MahjongTileInstance[]>();
  for (const tile of hand) byType.set(tile.tileType, [...(byType.get(tile.tileType) ?? []), tile]);
  return [...byType.entries()]
    .filter(([, tiles]) => tiles.length === 4)
    .map(([tileType, tiles]) => ({
      type: 'declare-concealed-kong',
      tileType,
      tileIds: tiles.map((tile) => tile.tileId),
    }));
}

function findAddedKongs(state: MahjongState, seat: MahjongSeat): Extract<MahjongLegalAction, { type: 'declare-added-kong' }>[] {
  const player = state.players[seat];
  return player.melds.flatMap((meld) => {
    if (meld.type !== 'pung' || meld.claimedTileId === null) return [];
    const tile = player.concealedTiles.find((candidate) => candidate.tileType === meld.tiles[0]?.tileType);
    return tile ? [{ type: 'declare-added-kong' as const, meldClaimedTileId: meld.claimedTileId, tileId: tile.tileId, tileType: tile.tileType }] : [];
  });
}

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
  const exposedKong = orderedSeats.filter((seat) => state.players[seat].concealedTiles.filter((tile) => tile.tileType === discard.tile.tileType).length === 3)
    .map((seat): MahjongReaction => ({ seat, type: 'exposed-kong' }));
  const pung = orderedSeats.filter((seat) => state.players[seat].concealedTiles.filter((tile) => tile.tileType === discard.tile.tileType).length >= 2)
    .map((seat): MahjongReaction => ({ seat, type: 'pung' }));
  const nextSeat = getNextSeat(discard.seat);
  const chiOptions = findChiOptions(state.players[nextSeat].concealedTiles, discard.tile);
  const chi: MahjongReaction[] = chiOptions.length ? [{ seat: nextSeat, type: 'chi', chiOptions }] : [];
  return [...hu, ...exposedKong, ...pung, ...chi];
}

export function getLegalActions(state: MahjongState, seat: MahjongSeat): MahjongLegalAction[] {
  if (state.phase === 'ended' || state.status !== 'playing') return [];
  if (state.phase === 'awaiting-discard') {
    if (state.currentSeat !== seat) return [];
    const player = state.players[seat];
    const actions: MahjongLegalAction[] = [{ type: 'discard-tile' }];
    actions.unshift(...findAddedKongs(state, seat));
    actions.unshift(...findConcealedKongs(player.concealedTiles));
    if (isWinningHand(player.concealedTiles, player.melds.length)) actions.unshift({ type: 'declare-hu', winType: 'self-draw' });
    return actions;
  }
  const reactionState = state.reactionState;
  const reaction = reactionState?.queue[0];
  if (!reactionState || !reaction || reaction.seat !== seat) return [];
  const actions: MahjongLegalAction[] = [];
  const allSeatReactions = reactionState.queue.filter((candidate) => candidate.seat === seat);
  const seatReactions = reaction.type === 'exposed-kong'
    ? allSeatReactions.filter((candidate) => candidate.type === 'exposed-kong' || candidate.type === 'pung')
    : allSeatReactions.filter((candidate) => candidate.type === reaction.type);
  if (seatReactions.some((candidate) => candidate.type === 'hu')) actions.unshift({ type: 'declare-hu', winType: 'discard-win' });
  if (seatReactions.some((candidate) => candidate.type === 'exposed-kong')) actions.push({ type: 'claim-exposed-kong', tileType: reactionState.discard.tile.tileType });
  if (seatReactions.some((candidate) => candidate.type === 'pung')) actions.push({ type: 'claim-pung' });
  const chi = seatReactions.find((candidate) => candidate.type === 'chi');
  if (chi) actions.push(...(chi.chiOptions ?? []).map((tileIds) => ({ type: 'claim-chi' as const, tileIds })));
  actions.push({ type: 'pass-reaction' });
  return actions;
}
