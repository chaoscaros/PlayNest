import { describe, expect, it } from 'vitest';
import { createMahjongTileSet, getAllTileTypes, getNextSeat, shuffleMahjongTiles, sortMahjongTiles } from './tiles';
import { testTiles } from './testHelpers';

describe('Mahjong tile set', () => {
  it('creates 136 unique tile instances across 34 types', () => {
    const tiles = createMahjongTileSet();
    expect(tiles).toHaveLength(136);
    expect(new Set(tiles.map((tile) => tile.tileId)).size).toBe(136);
    expect(new Set(tiles.map((tile) => tile.tileType)).size).toBe(34);
  });

  it('creates exactly four copies of every tile type', () => {
    const tiles = createMahjongTileSet();
    for (const tileType of getAllTileTypes()) expect(tiles.filter((tile) => tile.tileType === tileType)).toHaveLength(4);
  });

  it('uses one canonical seat order', () => {
    expect(getNextSeat('east')).toBe('south');
    expect(getNextSeat('north')).toBe('east');
    expect(getNextSeat('east', 3)).toBe('north');
  });

  it('sorts suits and honors for display only', () => {
    const sorted = sortMahjongTiles(testTiles(['red-dragon', 'dots-2', 'characters-9', 'bamboo-1', 'characters-1']));
    expect(sorted.map((tile) => tile.tileType)).toEqual(['characters-1', 'characters-9', 'bamboo-1', 'dots-2', 'red-dragon']);
  });

  it('supports deterministic shuffle injection', () => {
    const source = createMahjongTileSet().slice(0, 5);
    expect(shuffleMahjongTiles(source, () => 0).map((tile) => tile.tileId)).toEqual(shuffleMahjongTiles(source, () => 0).map((tile) => tile.tileId));
  });
});
