import { beforeEach, describe, expect, it } from 'vitest';
import { applyMahjongAction, createMahjongGame, drawNormalTile, drawReplacementTile, MahjongRuleError } from './mahjongGame';
import { getLegalActions } from './legalActions';
import type { MahjongState } from './mahjongTypes';
import { createMahjongTileSet, MAHJONG_SEATS } from './tiles';
import { resetTestTileIds, testState, testTiles } from './testHelpers';

function countLocatedTiles(state: MahjongState): number {
  return state.wall.length + MAHJONG_SEATS.reduce((total, seat) => {
    const player = state.players[seat];
    return total + player.concealedTiles.length + player.discards.length + player.melds.reduce((sum, meld) => sum + meld.tiles.length, 0);
  }, 0);
}

function locatedTileIds(state: MahjongState): number[] {
  return MAHJONG_SEATS.flatMap((seat) => [
    ...state.players[seat].concealedTiles,
    ...state.players[seat].discards,
    ...state.players[seat].melds.flatMap((meld) => meld.tiles),
  ]).concat(state.wall).map((tile) => tile.tileId);
}

function fullTestState(): MahjongState {
  const tiles = createMahjongTileSet();
  return testState({ wall: tiles, initialWall: tiles.map((tile) => ({ ...tile })) });
}

function takeTiles(state: MahjongState, types: Parameters<typeof testTiles>[0]) {
  return types.map((tileType) => {
    const index = state.wall.findIndex((tile) => tile.tileType === tileType);
    if (index < 0) throw new Error(`Missing fixture tile ${tileType}`);
    return state.wall.splice(index, 1)[0];
  });
}

function expectAllTilesConserved(state: MahjongState): void {
  const ids = locatedTileIds(state);
  expect(ids).toHaveLength(136);
  expect(new Set(ids).size).toBe(136);
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

  it('draws normally from the wall front and replacement tiles from the wall back', () => {
    const state = testState({ wall: testTiles(['characters-1', 'dots-9']) });
    const normal = drawNormalTile(state, 'east');
    expect(normal.players.east.concealedTiles[0].tileType).toBe('characters-1');
    const replacementState = testState({ wall: testTiles(['characters-1', 'dots-9']) });
    const replacement = drawReplacementTile(replacementState, 'east');
    expect(replacement.players.east.concealedTiles[0].tileType).toBe('dots-9');
  });

  it('declares a concealed Kong, exposes four instances as one meld, and draws from the tail', () => {
    const state = fullTestState();
    const kong = takeTiles(state, ['characters-5', 'characters-5', 'characters-5', 'characters-5']);
    state.players.east.concealedTiles = [...kong, ...takeTiles(state, ['east'])];
    const tail = state.wall[state.wall.length - 1];
    const next = applyMahjongAction(state, { type: 'declare-concealed-kong', seat: 'east', tileIds: kong.map((tile) => tile.tileId) });
    expect(next.players.east.melds[0]).toMatchObject({ type: 'concealed-kong', claimedTileId: null });
    expect(next.players.east.melds[0].tiles).toHaveLength(4);
    expect(next.players.east.concealedTiles.some((tile) => tile.tileId === tail.tileId)).toBe(true);
    expectAllTilesConserved(next);
  });

  it('rejects an invalid concealed Kong selection', () => {
    const state = testState();
    const tiles = testTiles(['characters-5', 'characters-5', 'characters-5']);
    state.players.east.concealedTiles = tiles;
    expect(() => applyMahjongAction(state, { type: 'declare-concealed-kong', seat: 'east', tileIds: tiles.map((tile) => tile.tileId) })).toThrow('four');
  });

  it('claims an exposed Kong, removes the pending discard, and conserves 136 unique tiles', () => {
    const state = fullTestState();
    const [discarded, ...matching] = takeTiles(state, ['red-dragon', 'red-dragon', 'red-dragon', 'red-dragon']);
    state.players.east.discards = [discarded];
    state.players.south.concealedTiles = matching;
    state.phase = 'awaiting-reaction';
    state.lastDiscard = { seat: 'east', tile: discarded };
    state.reactionState = { discard: state.lastDiscard, queue: [{ seat: 'south', type: 'exposed-kong' }, { seat: 'south', type: 'pung' }] };
    const next = applyMahjongAction(state, { type: 'claim-exposed-kong', seat: 'south' });
    expect(next.players.east.discards).toHaveLength(0);
    expect(next.players.south.melds[0]).toMatchObject({ type: 'exposed-kong', fromSeat: 'east', claimedTileId: discarded.tileId });
    expect(next.players.south.melds[0].tiles).toHaveLength(4);
    expect(next.currentSeat).toBe('south');
    expectAllTilesConserved(next);
  });

  it('upgrades an existing Pung to an added Kong without copying its tiles', () => {
    const state = fullTestState();
    const [one, two, three, fourth] = takeTiles(state, ['dots-7', 'dots-7', 'dots-7', 'dots-7']);
    state.players.east.melds = [{ type: 'pung', tiles: [one, two, three], fromSeat: 'south', claimedTileId: three.tileId }];
    state.players.east.concealedTiles = [fourth];
    const next = applyMahjongAction(state, { type: 'declare-added-kong', seat: 'east', meldClaimedTileId: three.tileId, tileId: fourth.tileId });
    expect(next.players.east.melds[0].type).toBe('added-kong');
    expect(next.players.east.melds[0].tiles.map((tile) => tile.tileId)).toEqual(expect.arrayContaining([one.tileId, two.tileId, three.tileId, fourth.tileId]));
    expect(new Set(next.players.east.melds[0].tiles.map((tile) => tile.tileId)).size).toBe(4);
    expectAllTilesConserved(next);
  });

  it('allows consecutive Kongs and keeps the same seat active', () => {
    const state = fullTestState();
    const first = takeTiles(state, ['characters-2', 'characters-2', 'characters-2', 'characters-2']);
    const second = takeTiles(state, ['bamboo-8', 'bamboo-8', 'bamboo-8', 'bamboo-8']);
    state.players.east.concealedTiles = [...first, ...second];
    const afterFirst = applyMahjongAction(state, { type: 'declare-concealed-kong', seat: 'east', tileIds: first.map((tile) => tile.tileId) });
    const afterSecond = applyMahjongAction(afterFirst, { type: 'declare-concealed-kong', seat: 'east', tileIds: second.map((tile) => tile.tileId) });
    expect(afterSecond.players.east.melds.map((meld) => meld.type)).toEqual(['concealed-kong', 'concealed-kong']);
    expect(afterSecond.currentSeat).toBe('east');
    expectAllTilesConserved(afterSecond);
  });

  it('allows Hu after a replacement draw with a Kong counting as one meld', () => {
    const state = fullTestState();
    const kong = takeTiles(state, ['characters-9', 'characters-9', 'characters-9', 'characters-9']);
    state.players.east.concealedTiles = [...kong, ...takeTiles(state, ['characters-1','characters-2','characters-3','bamboo-1','bamboo-2','bamboo-3','dots-1','dots-2','dots-3','red-dragon'])];
    state.wall.push(...takeTiles(state, ['red-dragon']));
    const afterKong = applyMahjongAction(state, { type: 'declare-concealed-kong', seat: 'east', tileIds: kong.map((tile) => tile.tileId) });
    expect(getLegalActions(afterKong, 'east').some((action) => action.type === 'declare-hu')).toBe(true);
    const won = applyMahjongAction(afterKong, { type: 'declare-hu', seat: 'east' });
    expect(won.status).toBe('won');
    expectAllTilesConserved(won);
  });

  it('ends in a draw when no replacement tile remains after a legal Kong', () => {
    const state = testState({ wall: [] });
    const kong = testTiles(['white-dragon', 'white-dragon', 'white-dragon', 'white-dragon']);
    state.players.east.concealedTiles = kong;
    const next = applyMahjongAction(state, { type: 'declare-concealed-kong', seat: 'east', tileIds: kong.map((tile) => tile.tileId) });
    expect(next).toMatchObject({ phase: 'ended', status: 'draw' });
  });
});
