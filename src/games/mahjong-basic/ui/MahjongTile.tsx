import type { MahjongTileInstance } from '../core';
import { tileLabels } from '../core';
import { MahjongTileArtwork } from './mahjongTileArtwork';

export function MahjongTile({ tile, selected = false, compact = false, faceDown = false, onClick }: { tile: MahjongTileInstance; selected?: boolean; compact?: boolean; faceDown?: boolean; onClick?: () => void }) {
  const className = `mahjong-tile ${selected ? 'selected' : ''} ${compact ? 'compact' : ''} ${faceDown ? 'face-down' : ''}`;
  if (faceDown) return <span className={className} aria-label="暗杠牌背"><i className="mahjong-tile-back" /></span>;
  const content = <MahjongTileArtwork tileType={tile.tileType} />;
  if (!onClick) return <span className={className} data-tile-type={tile.tileType} aria-label={tileLabels[tile.tileType]}>{content}</span>;
  return <button className={className} data-tile-type={tile.tileType} onClick={onClick} aria-pressed={selected} aria-label={`${selected ? '已选择' : '选择'}${tileLabels[tile.tileType]}`}>{content}</button>;
}
