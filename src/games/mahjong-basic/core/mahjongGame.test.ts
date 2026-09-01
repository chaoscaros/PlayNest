import { beforeEach, describe, expect, it } from 'vitest';
import { applyMahjongAction, createMahjongGame, MahjongRuleError } from './mahjongGame';
import type { MahjongState } from './mahjongTypes';
import { createMahjongTileSet, MAHJONG_SEATS } from './tiles';
import { resetTestTileIds, testState, testTiles } from './testHelpers';

function countLocatedTiles(state: MahjongState): number {
  return state.wall.length + MAHJONG_SEATS.reduce((total, seat) => {
    const player = state.players[seat];
    return total + player.concealedTiles.length + player.discards.length + player.melds.reduce((sum, meld) => sum + meld.tiles.length, 0);
  }, 0);
}

describe('Mahjong game state machine', () => {
  beforeEach(resetTestTileIds);

  it('deals 14 tiles to East, 13 to others, and leaves 83 in the wall', () => {
    const state = createMahjongGame({ wall: createMahjongTileSet() });
    expect(state.players.east.concealedTiles).toHaveLength(14);
    expect(state.players.south.concealedTiles).toHaveLength(13);
    expect(state.players.west.concealedTiles).toHaveLength(13);
    expect(state.players.north.concealedTiles).toHaveLength(13);
    expect(state.wall).toHaveLength(83);
    expect(countLocatedTiles(state)).toBe(136);
  });

  it('rejects malformed walls and duplicate tile IDs', () => {
    expect(() => createMahjongGame({ wall: [] })).toThrow(MahjongRuleError);
    const wall = createMahjongTileSet();
    wall[1] = { ...wall[1], tileId: wall[0].tileId };
    expect(() => createMahjongGame({ wall })).toThrow('unique');
  });

  it('lets only the current seat discard an owned tile', () => {
    const state = testState();
    const eastTile = testTiles(['red-dragon'])[0];
    state.players.east.concealedTiles = [eastTile];
    expect(() => applyMahjongAction(state, { type: 'discard-tile', seat: 'south', tileId: eastTile.tileId })).toThrow('turn');
    expect(() => applyMahjongAction(state, { type: 'discard-tile', seat: 'east', tileId: 999 })).toThrow('belong');
  });

  it('discards and automatically draws for the next seat when nobody reacts', () => {
    const state = testState({ wall: testTiles(['dots-9']) });
    const eastTile = testTiles(['red-dragon'])[0];
    state.players.east.concealedTiles = [eastTile];
    const next = applyMahjongAction(state, { type: 'discard-tile', seat: 'east', tileId: eastTile.tileId });
    expect(next.players.east.discards).toEqual([eastTile]);
    expect(next.currentSeat).toBe('south');
    expect(next.players.south.concealedTiles.map((tile) => tile.tileType)).toEqual(['dots-9']);
    expect(next.wall).toHaveLength(0);
    expect(next.phase).toBe('awaiting-discard');
  });

  it('rejects discards in the wrong phase and after game end', () => {
    const tile = testTiles(['east'])[0];
    const reaction = testState({ phase: 'awaiting-reaction' });
    reaction.players.east.concealedTiles = [tile];
    expect(() => applyMahjongAction(reaction, { type: 'discard-tile', seat: 'east', tileId: tile.tileId })).toThrow('discard phase');
    const ended = testState({ phase: 'ended', status: 'draw' });
    expect(() => applyMahjongAction(ended, { type: 'discard-tile', seat: 'east', tileId: tile.tileId })).toThrow('ended');
  });

  it('claims Pung without drawing and removes the claimed discard', () => {
    const discardedTile = testTiles(['red-dragon'])[0];
    const state = testState({ phase: 'awaiting-reaction', lastDiscard: { seat: 'east', tile: discardedTile } });
    state.players.east.discards = [discardedTile];
    state.players.west.concealedTiles = [...testTiles(['red-dragon','red-dragon']), ...testTiles(['dots-1'])];
    state.reactionState = { discard: { seat: 'east', tile: discardedTile }, queue: [{ seat: 'west', type: 'pung' }] };
    const next = applyMahjongAction(state, { type: 'claim-pung', seat: 'west' });
    expect(next.players.east.discards).toHaveLength(0);
    expect(next.players.west.melds[0].tiles).toHaveLength(3);
    expect(next.players.west.concealedTiles.map((tile) => tile.tileType)).toEqual(['dots-1']);
    expect(next.currentSeat).toBe('west');
    expect(next.phase).toBe('awaiting-discard');
    expect(next.lastDiscard).toBeNull();
  });

  it('claims a specifically selected Chi and validates tile IDs', () => {
    const discardedTile = testTiles(['characters-5'])[0];
    const selected = testTiles(['characters-3','characters-4']);
    const state = testState({ phase: 'awaiting-reaction', lastDiscard: { seat: 'east', tile: discardedTile } });
    state.players.east.discards = [discardedTile];
    state.players.south.concealedTiles = [...selected, ...testTiles(['bamboo-1'])];
    state.reactionState = { discard: { seat: 'east', tile: discardedTile }, queue: [{ seat: 'south', type: 'chi', chiOptions: [selected.map((tile) => tile.tileId)] }] };
    expect(() => applyMahjongAction(state, { type: 'claim-chi', seat: 'south', tileIds: [selected[0].tileId, 999] })).toThrow('legal Chi');
    const next = applyMahjongAction(state, { type: 'claim-chi', seat: 'south', tileIds: selected.map((tile) => tile.tileId) });
    expect(next.players.south.melds[0].tiles.map((tile) => tile.tileType)).toEqual(['characters-3','characters-4','characters-5']);
    expect(next.wall).toHaveLength(1);
    expect(next.currentSeat).toBe('south');
    expect(next.lastDiscard).toBeNull();
  });

  it('moves through reaction queue when players pass', () => {
    const discard = { seat: 'east' as const, tile: testTiles(['east'])[0] };
    const state = testState({ phase: 'awaiting-reaction', lastDiscard: discard });
    state.reactionState = { discard, queue: [{ seat: 'south', type: 'hu' }, { seat: 'west', type: 'pung' }] };
    const afterFirstPass = applyMahjongAction(state, { type: 'pass-reaction', seat: 'south' });
    expect(afterFirstPass.reactionState?.queue[0]).toEqual({ seat: 'west', type: 'pung' });
  });

  it('declares self draw and discard win', () => {
    const winningTypes = ['characters-1','characters-2','characters-3','bamboo-1','bamboo-2','bamboo-3','dots-1','dots-2','dots-3','east','east','east','red-dragon','red-dragon'] as const;
    const selfDraw = testState();
    selfDraw.players.east.concealedTiles = testTiles(winningTypes);
    const selfResult = applyMahjongAction(selfDraw, { type: 'declare-hu', seat: 'east' });
    expect(selfResult).toMatchObject({ status: 'won', winner: 'east', winType: 'self-draw' });

    const discard = { seat: 'east' as const, tile: testTiles(['red-dragon'])[0] };
    const discardWin = testState({ phase: 'awaiting-reaction', lastDiscard: discard });
    discardWin.reactionState = { discard, queue: [{ seat: 'south', type: 'hu' }] };
    const discardResult = applyMahjongAction(discardWin, { type: 'declare-hu', seat: 'south' });
    expect(discardResult).toMatchObject({ status: 'won', winner: 'south', winType: 'discard-win' });
  });

  it('ends in a draw when the wall is exhausted after all reactions', () => {
    const discard = { seat: 'east' as const, tile: testTiles(['east'])[0] };
    const state = testState({ phase: 'awaiting-reaction', lastDiscard: discard, wall: [] });
    state.reactionState = { discard, queue: [{ seat: 'south', type: 'chi', chiOptions: [[1, 2]] }] };
    const next = applyMahjongAction(state, { type: 'pass-reaction', seat: 'south' });
    expect(next).toMatchObject({ phase: 'ended', status: 'draw', winner: null });
  });

  it('is deterministic for the same wall and actions', () => {
    const wall = createMahjongTileSet();
    const first = createMahjongGame({ wall });
    const second = createMahjongGame({ wall });
    const tileId = first.players.east.concealedTiles[0].tileId;
    expect(applyMahjongAction(first, { type: 'discard-tile', seat: 'east', tileId })).toEqual(applyMahjongAction(second, { type: 'discard-tile', seat: 'east', tileId }));
  });

  it('conserves all 136 tile instances through a discard', () => {
    const state = createMahjongGame({ wall: createMahjongTileSet() });
    const next = applyMahjongAction(state, { type: 'discard-tile', seat: 'east', tileId: state.players.east.concealedTiles[0].tileId });
    expect(countLocatedTiles(next)).toBe(136);
    const ids = MAHJONG_SEATS.flatMap((seat) => [
      ...next.players[seat].concealedTiles,
      ...next.players[seat].discards,
      ...next.players[seat].melds.flatMap((meld) => meld.tiles),
    ]).concat(next.wall).map((tile) => tile.tileId);
    expect(new Set(ids).size).toBe(136);
  });
});
