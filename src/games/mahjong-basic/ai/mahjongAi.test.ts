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
});
