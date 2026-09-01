import * as TileArtwork from 'react-riichi-mahjong-tiles';
import type { MahjongTileType } from '../core';
import { createElement } from 'react';

const artworkByTileType: Record<MahjongTileType, TileArtwork.MahjongTileComponent> = {
  'characters-1': TileArtwork.Man1,
  'characters-2': TileArtwork.Man2,
  'characters-3': TileArtwork.Man3,
  'characters-4': TileArtwork.Man4,
  'characters-5': TileArtwork.Man5,
  'characters-6': TileArtwork.Man6,
  'characters-7': TileArtwork.Man7,
  'characters-8': TileArtwork.Man8,
  'characters-9': TileArtwork.Man9,
  'dots-1': TileArtwork.Pin1,
  'dots-2': TileArtwork.Pin2,
  'dots-3': TileArtwork.Pin3,
  'dots-4': TileArtwork.Pin4,
  'dots-5': TileArtwork.Pin5,
  'dots-6': TileArtwork.Pin6,
  'dots-7': TileArtwork.Pin7,
  'dots-8': TileArtwork.Pin8,
  'dots-9': TileArtwork.Pin9,
  'bamboo-1': TileArtwork.Sou1,
  'bamboo-2': TileArtwork.Sou2,
  'bamboo-3': TileArtwork.Sou3,
  'bamboo-4': TileArtwork.Sou4,
  'bamboo-5': TileArtwork.Sou5,
  'bamboo-6': TileArtwork.Sou6,
  'bamboo-7': TileArtwork.Sou7,
  'bamboo-8': TileArtwork.Sou8,
  'bamboo-9': TileArtwork.Sou9,
  east: TileArtwork.Ton,
  south: TileArtwork.Nan,
  west: TileArtwork.Shaa,
  north: TileArtwork.Pei,
  'red-dragon': TileArtwork.Chun,
  'green-dragon': TileArtwork.Hatsu,
  'white-dragon': TileArtwork.Haku,
};

export function MahjongTileArtwork({ tileType }: { tileType: MahjongTileType }) {
  return createElement(artworkByTileType[tileType], {
    className: 'mahjong-tile-face',
    'aria-hidden': true,
    focusable: 'false',
  });
}
