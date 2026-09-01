import type { MahjongTileInstance } from '../core';
import { tileLabels } from '../core';

function tileTone(tile: MahjongTileInstance): string {
  if (tile.tileType.startsWith('characters') || tile.tileType === 'red-dragon') return 'tile-red';
  if (tile.tileType.startsWith('bamboo') || tile.tileType === 'green-dragon') return 'tile-green';
  if (tile.tileType.startsWith('dots')) return 'tile-blue';
  return 'tile-ink';
}

export function MahjongTile({ tile, selected = false, compact = false, onClick }: { tile: MahjongTileInstance; selected?: boolean; compact?: boolean; onClick?: () => void }) {
  const className = `mahjong-tile ${tileTone(tile)} ${selected ? 'selected' : ''} ${compact ? 'compact' : ''}`;
  const content = <><span>{tileLabels[tile.tileType]}</span><small>{tile.tileType.startsWith('characters') ? '萬' : tile.tileType.startsWith('bamboo') ? '索' : tile.tileType.startsWith('dots') ? '筒' : '字'}</small></>;
  if (!onClick) return <span className={className} aria-label={tileLabels[tile.tileType]}>{content}</span>;
  return <button className={className} onClick={onClick} aria-pressed={selected} aria-label={`${selected ? '已选择' : '选择'}${tileLabels[tile.tileType]}`}>{content}</button>;
}
