import type { MahjongTileInstance, MahjongTileType } from './mahjongTypes';
import { getAllTileTypes, parseSuitedTile } from './tiles';

const tileTypes = getAllTileTypes();
const tileIndex = new Map(tileTypes.map((type, index) => [type, index]));

function canBuildMelds(counts: number[], meldsNeeded: number): boolean {
  if (meldsNeeded === 0) return counts.every((count) => count === 0);
  const first = counts.findIndex((count) => count > 0);
  if (first < 0) return false;

  if (counts[first] >= 3) {
    counts[first] -= 3;
    if (canBuildMelds(counts, meldsNeeded - 1)) return true;
    counts[first] += 3;
  }

  const tile = parseSuitedTile(tileTypes[first]);
  if (tile && tile.rank <= 7) {
    const second = tileIndex.get(`${tile.suit}-${tile.rank + 1}` as MahjongTileType);
    const third = tileIndex.get(`${tile.suit}-${tile.rank + 2}` as MahjongTileType);
    if (second !== undefined && third !== undefined && counts[second] > 0 && counts[third] > 0) {
      counts[first] -= 1;
      counts[second] -= 1;
      counts[third] -= 1;
      if (canBuildMelds(counts, meldsNeeded - 1)) return true;
      counts[first] += 1;
      counts[second] += 1;
      counts[third] += 1;
    }
  }

  return false;
}

export function isWinningHand(tiles: readonly Pick<MahjongTileInstance, 'tileType'>[], meldCount = 0): boolean {
  const meldsNeeded = 4 - meldCount;
  if (meldsNeeded < 0 || tiles.length !== meldsNeeded * 3 + 2) return false;
  const counts = Array<number>(tileTypes.length).fill(0);
  for (const tile of tiles) {
    const index = tileIndex.get(tile.tileType);
    if (index === undefined) return false;
    counts[index] += 1;
  }

  for (let pairIndex = 0; pairIndex < counts.length; pairIndex += 1) {
    if (counts[pairIndex] < 2) continue;
    counts[pairIndex] -= 2;
    if (canBuildMelds(counts, meldsNeeded)) return true;
    counts[pairIndex] += 2;
  }
  return false;
}
