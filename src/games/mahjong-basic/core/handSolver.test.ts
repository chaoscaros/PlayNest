import { describe, expect, it } from 'vitest';
import type { MahjongTileType } from './mahjongTypes';
import { isWinningHand } from './handSolver';
import { testTiles } from './testHelpers';

const hand = (...types: MahjongTileType[]) => testTiles(types);

describe('isWinningHand', () => {
  it.each([
    ['four sequences', ['characters-1','characters-2','characters-3','characters-4','characters-5','characters-6','bamboo-1','bamboo-2','bamboo-3','dots-7','dots-8','dots-9','east','east']],
    ['four triplets', ['characters-1','characters-1','characters-1','bamboo-2','bamboo-2','bamboo-2','dots-3','dots-3','dots-3','east','east','east','red-dragon','red-dragon']],
    ['mixed melds and honor triplet', ['characters-1','characters-2','characters-3','bamboo-4','bamboo-5','bamboo-6','dots-9','dots-9','dots-9','green-dragon','green-dragon','green-dragon','north','north']],
    ['ambiguous long run', ['characters-1','characters-1','characters-1','characters-2','characters-3','characters-4','characters-5','characters-6','characters-7','characters-7','characters-8','characters-9','south','south']],
  ] as const)('accepts %s', (_name, types) => expect(isWinningHand(hand(...types))).toBe(true));

  it.each([
    ['missing pair', ['characters-1','characters-2','characters-3','characters-4','characters-5','characters-6','bamboo-1','bamboo-2','bamboo-3','dots-7','dots-8','dots-9','east','south']],
    ['broken sequence', ['characters-1','characters-2','characters-4','characters-4','characters-5','characters-6','bamboo-1','bamboo-2','bamboo-3','dots-7','dots-8','dots-9','east','east']],
    ['honor sequence attempt', ['east','south','west','characters-1','characters-2','characters-3','bamboo-1','bamboo-2','bamboo-3','dots-1','dots-2','dots-3','north','north']],
    ['seven pairs', ['characters-1','characters-1','characters-2','characters-2','bamboo-1','bamboo-1','bamboo-2','bamboo-2','dots-1','dots-1','east','east','red-dragon','red-dragon']],
    ['thirteen orphans shape', ['characters-1','characters-9','bamboo-1','bamboo-9','dots-1','dots-9','east','south','west','north','red-dragon','green-dragon','white-dragon','east']],
  ] as const)('rejects %s', (_name, types) => expect(isWinningHand(hand(...types))).toBe(false));

  it('accounts for existing open melds', () => {
    expect(isWinningHand(hand('characters-1','characters-2','characters-3','bamboo-6','bamboo-7','bamboo-8','east','east'), 2)).toBe(true);
  });
});
