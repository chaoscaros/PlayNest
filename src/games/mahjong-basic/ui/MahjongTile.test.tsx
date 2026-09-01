import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { getAllTileTypes, tileLabels } from '../core';
import { MahjongTile } from './MahjongTile';

describe('MahjongTile', () => {
  it('renders real SVG artwork for every supported tile type', () => {
    const tileTypes = getAllTileTypes();
    const { container } = render(<>{tileTypes.map((tileType, tileId) => <MahjongTile key={tileType} tile={{ tileId, tileType }} />)}</>);
    expect(container.querySelectorAll('.mahjong-tile-face')).toHaveLength(34);
    for (const tileType of tileTypes) {
      const tile = container.querySelector(`[data-tile-type="${tileType}"]`);
      expect(tile).toHaveAttribute('aria-label', tileLabels[tileType]);
      expect(tile?.querySelector('svg')).toBeInTheDocument();
    }
  });
});
