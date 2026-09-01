import { beforeEach, describe, expect, it } from 'vitest';
import { resetTestTileIds, testState, testTiles } from '../core/testHelpers';
import { chooseMahjongAiAction, chooseMahjongAiDiscard } from './mahjongAi';

describe('mahjong AI', () => {
  beforeEach(resetTestTileIds);

  it('discards an isolated honor before connected suited tiles', () => {
    const hand = testTiles(['east', 'characters-2', 'characters-3', 'characters-4']);
    expect(chooseMahjongAiDiscard(hand)?.tileType).toBe('east');
  });

  it('always accepts Hu before any other action', () => {
    const state = testState({ phase: 'awaiting-reaction', currentSeat: 'south' });
    const discard = { seat: 'east' as const, tile: testTiles(['red-dragon'])[0] };
    state.lastDiscard = discard;
    state.reactionState = { discard, queue: [{ seat: 'south', type: 'hu' }] };
    expect(chooseMahjongAiAction(state, 'south')).toEqual({ type: 'declare-hu', seat: 'south' });
  });

  it('accepts Pung and otherwise passes a reaction', () => {
    const discard = { seat: 'east' as const, tile: testTiles(['north'])[0] };
    const pungState = testState({ phase: 'awaiting-reaction', lastDiscard: discard });
    pungState.reactionState = { discard, queue: [{ seat: 'south', type: 'pung' }] };
    expect(chooseMahjongAiAction(pungState, 'south')).toEqual({ type: 'claim-pung', seat: 'south' });

    const passState = testState({ phase: 'awaiting-reaction', lastDiscard: discard });
    passState.reactionState = { discard, queue: [{ seat: 'south', type: 'chi', chiOptions: [] }] };
    expect(chooseMahjongAiAction(passState, 'south')).toEqual({ type: 'pass-reaction', seat: 'south' });
  });

  it('chooses a legal deterministic discard on its turn', () => {
    const state = testState({ currentSeat: 'south' });
    state.players.south.concealedTiles = testTiles(['white-dragon', 'characters-4', 'characters-5']);
    expect(chooseMahjongAiAction(state, 'south')).toEqual({
      type: 'discard-tile',
      seat: 'south',
      tileId: state.players.south.concealedTiles[0].tileId,
    });
  });

  it('declares concealed and added Kongs on its own turn', () => {
    const concealed = testState({ currentSeat: 'south' });
    const kong = testTiles(['characters-6', 'characters-6', 'characters-6', 'characters-6']);
    concealed.players.south.concealedTiles = kong;
    expect(chooseMahjongAiAction(concealed, 'south')).toEqual({
      type: 'declare-concealed-kong', seat: 'south', tileIds: kong.map((tile) => tile.tileId),
    });

    const added = testState({ currentSeat: 'south' });
    const pung = testTiles(['dots-4', 'dots-4', 'dots-4']);
    const fourth = testTiles(['dots-4'])[0];
    added.players.south.melds = [{ type: 'pung', tiles: pung, fromSeat: 'east', claimedTileId: pung[2].tileId }];
    added.players.south.concealedTiles = [fourth];
    expect(chooseMahjongAiAction(added, 'south')).toEqual({
      type: 'declare-added-kong', seat: 'south', meldClaimedTileId: pung[2].tileId, tileId: fourth.tileId,
    });
  });

  it('claims exposed Kong before Pung', () => {
    const discard = { seat: 'east' as const, tile: testTiles(['green-dragon'])[0] };
    const state = testState({ phase: 'awaiting-reaction', lastDiscard: discard });
    state.players.south.concealedTiles = testTiles(['green-dragon', 'green-dragon', 'green-dragon']);
    state.reactionState = { discard, queue: [{ seat: 'south', type: 'exposed-kong' }, { seat: 'south', type: 'pung' }] };
    expect(chooseMahjongAiAction(state, 'south')).toEqual({ type: 'claim-exposed-kong', seat: 'south' });
  });

  it('does not choose a Kong over Hu', () => {
    const state = testState({ currentSeat: 'south' });
    state.players.south.concealedTiles = testTiles([
      'characters-1','characters-1','characters-1','characters-1','characters-2','characters-3',
      'bamboo-1','bamboo-2','bamboo-3','dots-1','dots-2','dots-3','east','east',
    ]);
    expect(state.players.south.concealedTiles.filter((tile) => tile.tileType === 'characters-1')).toHaveLength(4);
    expect(chooseMahjongAiAction(state, 'south')).toEqual({ type: 'declare-hu', seat: 'south' });
  });
});
