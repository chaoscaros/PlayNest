import type { MahjongRank, MahjongSeat, MahjongSuit, MahjongTileInstance, MahjongTileType } from './mahjongTypes';

export const MAHJONG_SEATS: readonly MahjongSeat[] = ['east', 'south', 'west', 'north'];
export const MAHJONG_SUITS: readonly MahjongSuit[] = ['characters', 'bamboo', 'dots'];
export const MAHJONG_HONORS = ['east', 'south', 'west', 'north', 'red-dragon', 'green-dragon', 'white-dragon'] as const;
export const MAHJONG_RANKS: readonly MahjongRank[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const seatLabels: Record<MahjongSeat, string> = { east: '东家', south: '南家', west: '西家', north: '北家' };
export const tileLabels: Record<MahjongTileType, string> = Object.fromEntries([
  ...MAHJONG_SUITS.flatMap((suit) => MAHJONG_RANKS.map((rank) => [`${suit}-${rank}`, `${'一二三四五六七八九'[rank - 1]}${suit === 'characters' ? '万' : suit === 'bamboo' ? '条' : '筒'}`])),
  ['east', '东'], ['south', '南'], ['west', '西'], ['north', '北'],
  ['red-dragon', '中'], ['green-dragon', '发'], ['white-dragon', '白'],
]) as Record<MahjongTileType, string>;

export function getAllTileTypes(): MahjongTileType[] {
  return [
    ...MAHJONG_SUITS.flatMap((suit) => MAHJONG_RANKS.map((rank) => `${suit}-${rank}` as MahjongTileType)),
    ...MAHJONG_HONORS,
  ];
}

export function createMahjongTileSet(): MahjongTileInstance[] {
  let tileId = 0;
  return getAllTileTypes().flatMap((tileType) => Array.from({ length: 4 }, () => ({ tileId: tileId++, tileType })));
}

export function shuffleMahjongTiles(tiles: readonly MahjongTileInstance[], random: () => number = Math.random): MahjongTileInstance[] {
  const shuffled = tiles.map((tile) => ({ ...tile }));
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }
  return shuffled;
}

export function getNextSeat(seat: MahjongSeat, distance = 1): MahjongSeat {
  const index = MAHJONG_SEATS.indexOf(seat);
  return MAHJONG_SEATS[(index + distance) % MAHJONG_SEATS.length];
}

export function getSeatDistance(from: MahjongSeat, to: MahjongSeat): number {
  const fromIndex = MAHJONG_SEATS.indexOf(from);
  const toIndex = MAHJONG_SEATS.indexOf(to);
  return (toIndex - fromIndex + MAHJONG_SEATS.length) % MAHJONG_SEATS.length;
}

function tileSortIndex(tileType: MahjongTileType): number {
  const suitIndex = MAHJONG_SUITS.findIndex((suit) => tileType.startsWith(`${suit}-`));
  if (suitIndex >= 0) return suitIndex * 9 + Number(tileType.split('-')[1]) - 1;
  return 27 + MAHJONG_HONORS.indexOf(tileType as (typeof MAHJONG_HONORS)[number]);
}

export function sortMahjongTiles(tiles: readonly MahjongTileInstance[]): MahjongTileInstance[] {
  return [...tiles].sort((left, right) => tileSortIndex(left.tileType) - tileSortIndex(right.tileType) || left.tileId - right.tileId);
}

export function parseSuitedTile(tileType: MahjongTileType): { suit: MahjongSuit; rank: MahjongRank } | null {
  const [suit, rankText] = tileType.split('-');
  if (!MAHJONG_SUITS.includes(suit as MahjongSuit)) return null;
  return { suit: suit as MahjongSuit, rank: Number(rankText) as MahjongRank };
}
