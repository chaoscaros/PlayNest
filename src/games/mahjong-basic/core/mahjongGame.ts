import { isWinningHand } from './handSolver';
import { buildReactionQueue, findChiOptions } from './legalActions';
import type { MahjongAction, MahjongDiscard, MahjongPlayerState, MahjongSeat, MahjongState, MahjongTileInstance } from './mahjongTypes';
import { createMahjongTileSet, getNextSeat, MAHJONG_SEATS, shuffleMahjongTiles, sortMahjongTiles } from './tiles';

export class MahjongRuleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MahjongRuleError';
  }
}

function clonePlayer(player: MahjongPlayerState): MahjongPlayerState {
  return {
    ...player,
    concealedTiles: player.concealedTiles.map((tile) => ({ ...tile })),
    melds: player.melds.map((meld) => ({ ...meld, tiles: meld.tiles.map((tile) => ({ ...tile })) })),
    discards: player.discards.map((tile) => ({ ...tile })),
  };
}

function cloneState(state: MahjongState): MahjongState {
  return {
    ...state,
    players: Object.fromEntries(MAHJONG_SEATS.map((seat) => [seat, clonePlayer(state.players[seat])])) as MahjongState['players'],
    wall: state.wall.map((tile) => ({ ...tile })),
    initialWall: state.initialWall.map((tile) => ({ ...tile })),
    lastDiscard: state.lastDiscard ? { seat: state.lastDiscard.seat, tile: { ...state.lastDiscard.tile } } : null,
    reactionState: state.reactionState ? {
      discard: { seat: state.reactionState.discard.seat, tile: { ...state.reactionState.discard.tile } },
      queue: state.reactionState.queue.map((reaction) => ({ ...reaction, chiOptions: reaction.chiOptions?.map((ids) => [...ids]) })),
    } : null,
  };
}

function createPlayer(seat: MahjongSeat): MahjongPlayerState {
  return { seat, concealedTiles: [], melds: [], discards: [] };
}

function validateWall(wall: readonly MahjongTileInstance[]): void {
  if (wall.length !== 136) throw new MahjongRuleError('A Mahjong wall must contain 136 tiles.');
  if (new Set(wall.map((tile) => tile.tileId)).size !== 136) throw new MahjongRuleError('Tile IDs must be unique.');
}

export function createMahjongGame(options: { wall?: readonly MahjongTileInstance[]; random?: () => number } = {}): MahjongState {
  const sourceWall = options.wall ? options.wall.map((tile) => ({ ...tile })) : shuffleMahjongTiles(createMahjongTileSet(), options.random);
  validateWall(sourceWall);
  const dealingWall = [...sourceWall];
  const players = Object.fromEntries(MAHJONG_SEATS.map((seat) => [seat, createPlayer(seat)])) as MahjongState['players'];
  for (let round = 0; round < 13; round += 1) {
    for (const seat of MAHJONG_SEATS) players[seat].concealedTiles.push(dealingWall.shift()!);
  }
  players.east.concealedTiles.push(dealingWall.shift()!);
  for (const seat of MAHJONG_SEATS) players[seat].concealedTiles = sortMahjongTiles(players[seat].concealedTiles);
  return {
    players,
    wall: dealingWall,
    initialWall: sourceWall,
    dealerSeat: 'east',
    currentSeat: 'east',
    phase: 'awaiting-discard',
    lastDiscard: null,
    reactionState: null,
    winner: null,
    winType: null,
    status: 'playing',
    actionCount: 0,
  };
}

function requirePlaying(state: MahjongState): void {
  if (state.status !== 'playing' || state.phase === 'ended') throw new MahjongRuleError('The game has already ended.');
}

function endAsDraw(state: MahjongState): MahjongState {
  return { ...state, phase: 'ended', status: 'draw', reactionState: null, winner: null, winType: null };
}

function drawForNextSeat(state: MahjongState, discardedBy: MahjongSeat): MahjongState {
  const nextSeat = getNextSeat(discardedBy);
  if (state.wall.length === 0) return endAsDraw({ ...state, currentSeat: nextSeat });
  const [drawn, ...wall] = state.wall;
  state.players[nextSeat].concealedTiles = sortMahjongTiles([...state.players[nextSeat].concealedTiles, drawn]);
  return { ...state, wall, currentSeat: nextSeat, phase: 'awaiting-discard', reactionState: null };
}

function removeClaimedDiscard(state: MahjongState, discard: MahjongDiscard): void {
  const discards = state.players[discard.seat].discards;
  const index = discards.findIndex((tile) => tile.tileId === discard.tile.tileId);
  if (index < 0) throw new MahjongRuleError('The claimed discard is no longer available.');
  discards.splice(index, 1);
}

function discardTile(state: MahjongState, action: Extract<MahjongAction, { type: 'discard-tile' }>): MahjongState {
  if (state.phase !== 'awaiting-discard') throw new MahjongRuleError('Tiles can only be discarded during the discard phase.');
  if (state.currentSeat !== action.seat) throw new MahjongRuleError('It is not this seat’s turn.');
  const player = state.players[action.seat];
  const tileIndex = player.concealedTiles.findIndex((tile) => tile.tileId === action.tileId);
  if (tileIndex < 0) throw new MahjongRuleError('The selected tile does not belong to this seat.');
  const [tile] = player.concealedTiles.splice(tileIndex, 1);
  player.discards.push(tile);
  const lastDiscard = { seat: action.seat, tile };
  const provisional = { ...state, lastDiscard, phase: 'awaiting-reaction' as const };
  const queue = buildReactionQueue(provisional);
  if (queue.length === 0) return drawForNextSeat(provisional, action.seat);
  return { ...provisional, reactionState: { discard: lastDiscard, queue } };
}

function declareHu(state: MahjongState, action: Extract<MahjongAction, { type: 'declare-hu' }>): MahjongState {
  if (state.phase === 'awaiting-discard') {
    if (state.currentSeat !== action.seat) throw new MahjongRuleError('It is not this seat’s turn.');
    const player = state.players[action.seat];
    if (!isWinningHand(player.concealedTiles, player.melds.length)) throw new MahjongRuleError('This hand cannot declare Hu.');
    return { ...state, phase: 'ended', status: 'won', winner: action.seat, winType: 'self-draw' };
  }
  const reaction = state.reactionState?.queue[0];
  if (!reaction || reaction.seat !== action.seat || reaction.type !== 'hu') throw new MahjongRuleError('This seat cannot declare Hu now.');
  return { ...state, phase: 'ended', status: 'won', winner: action.seat, winType: 'discard-win', reactionState: null };
}

function claimPung(state: MahjongState, action: Extract<MahjongAction, { type: 'claim-pung' }>): MahjongState {
  const reaction = state.reactionState?.queue[0];
  const discard = state.reactionState?.discard;
  if (!reaction || !discard || reaction.seat !== action.seat || reaction.type !== 'pung') throw new MahjongRuleError('This seat cannot claim Pung now.');
  const player = state.players[action.seat];
  const matching = player.concealedTiles.filter((tile) => tile.tileType === discard.tile.tileType).slice(0, 2);
  if (matching.length !== 2) throw new MahjongRuleError('The required matching tiles are missing.');
  const ids = new Set(matching.map((tile) => tile.tileId));
  player.concealedTiles = player.concealedTiles.filter((tile) => !ids.has(tile.tileId));
  removeClaimedDiscard(state, discard);
  player.melds.push({ type: 'pung', tiles: sortMahjongTiles([...matching, discard.tile]), fromSeat: discard.seat, claimedTileId: discard.tile.tileId });
  return { ...state, currentSeat: action.seat, phase: 'awaiting-discard', reactionState: null, lastDiscard: null };
}

function claimChi(state: MahjongState, action: Extract<MahjongAction, { type: 'claim-chi' }>): MahjongState {
  const reaction = state.reactionState?.queue[0];
  const discard = state.reactionState?.discard;
  if (!reaction || !discard || reaction.seat !== action.seat || reaction.type !== 'chi') throw new MahjongRuleError('This seat cannot claim Chi now.');
  const normalized = [...action.tileIds].sort((a, b) => a - b);
  const valid = findChiOptions(state.players[action.seat].concealedTiles, discard.tile)
    .some((option) => [...option].sort((a, b) => a - b).every((id, index) => id === normalized[index]));
  if (!valid || normalized.length !== 2) throw new MahjongRuleError('The selected tiles do not form a legal Chi.');
  const selected = normalized.map((id) => state.players[action.seat].concealedTiles.find((tile) => tile.tileId === id));
  if (selected.some((tile) => !tile)) throw new MahjongRuleError('The selected Chi tiles are missing.');
  const selectedTiles = selected as MahjongTileInstance[];
  const ids = new Set(normalized);
  state.players[action.seat].concealedTiles = state.players[action.seat].concealedTiles.filter((tile) => !ids.has(tile.tileId));
  removeClaimedDiscard(state, discard);
  state.players[action.seat].melds.push({ type: 'chi', tiles: sortMahjongTiles([...selectedTiles, discard.tile]), fromSeat: discard.seat, claimedTileId: discard.tile.tileId });
  return { ...state, currentSeat: action.seat, phase: 'awaiting-discard', reactionState: null, lastDiscard: null };
}

function passReaction(state: MahjongState, action: Extract<MahjongAction, { type: 'pass-reaction' }>): MahjongState {
  const reactionState = state.reactionState;
  const current = reactionState?.queue[0];
  if (!reactionState || !current || current.seat !== action.seat) throw new MahjongRuleError('This seat has no reaction to pass.');
  const queue = reactionState.queue.slice(1);
  if (queue.length) return { ...state, reactionState: { ...reactionState, queue } };
  return drawForNextSeat({ ...state, reactionState: null }, reactionState.discard.seat);
}

export function applyMahjongAction(currentState: MahjongState, action: MahjongAction): MahjongState {
  requirePlaying(currentState);
  const state = cloneState(currentState);
  let next: MahjongState;
  switch (action.type) {
    case 'discard-tile': next = discardTile(state, action); break;
    case 'declare-hu': next = declareHu(state, action); break;
    case 'claim-pung': next = claimPung(state, action); break;
    case 'claim-chi': next = claimChi(state, action); break;
    case 'pass-reaction': next = passReaction(state, action); break;
  }
  return { ...next, actionCount: currentState.actionCount + 1 };
}
