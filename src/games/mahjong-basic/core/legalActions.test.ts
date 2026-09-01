import { beforeEach, describe, expect, it } from 'vitest';
import { buildReactionQueue, findChiOptions, getLegalActions } from './legalActions';
import { resetTestTileIds, testState, testTiles } from './testHelpers';

describe('Mahjong legal actions and reactions', () => {
  beforeEach(resetTestTileIds);

  it('offers all 345, 456, and 567 Chi choices for a five', () => {
    const discard = testTiles(['characters-5'])[0];
    const hand = testTiles(['characters-3','characters-4','characters-4','characters-6','characters-6','characters-7']);
    expect(findChiOptions(hand, discard)).toHaveLength(3);
  });

  it('does not allow honors to form Chi', () => {
    expect(findChiOptions(testTiles(['east','west']), testTiles(['south'])[0])).toEqual([]);
  });

  it('orders Hu before Pung before Chi', () => {
    const discard = { seat: 'east' as const, tile: testTiles(['characters-5'])[0] };
    const state = testState({ phase: 'awaiting-reaction', currentSeat: 'east', lastDiscard: discard });
    state.players.south.concealedTiles = testTiles(['characters-3','characters-4']);
    state.players.west.concealedTiles = testTiles(['characters-5','characters-5']);
    state.players.north.concealedTiles = testTiles(['characters-1','characters-2','characters-3','bamboo-1','bamboo-2','bamboo-3','dots-1','dots-2','dots-3','east','east','east','characters-5']);
    expect(buildReactionQueue(state).map((reaction) => reaction.type)).toEqual(['hu', 'pung', 'chi']);
  });

  it('orders multiple Hu candidates by distance from discarder', () => {
    const discard = { seat: 'east' as const, tile: testTiles(['characters-5'])[0] };
    const state = testState({ phase: 'awaiting-reaction', lastDiscard: discard });
    const ready = ['characters-1','characters-2','characters-3','bamboo-1','bamboo-2','bamboo-3','dots-1','dots-2','dots-3','east','east','east','characters-5'] as const;
    state.players.south.concealedTiles = testTiles(ready);
    state.players.west.concealedTiles = testTiles(ready);
    expect(buildReactionQueue(state).filter((reaction) => reaction.type === 'hu').map((reaction) => reaction.seat)).toEqual(['south', 'west']);
  });

  it('only exposes legal actions to the active reaction seat', () => {
    const state = testState({ phase: 'awaiting-reaction' });
    state.reactionState = { discard: { seat: 'east', tile: testTiles(['east'])[0] }, queue: [{ seat: 'west', type: 'pung' }] };
    expect(getLegalActions(state, 'west').map((action) => action.type)).toEqual(['claim-pung', 'pass-reaction']);
    expect(getLegalActions(state, 'south')).toEqual([]);
  });
});
