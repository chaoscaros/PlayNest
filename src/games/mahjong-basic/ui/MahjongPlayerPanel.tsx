import type { MahjongPlayerState, MahjongSeat } from '../core';
import { seatLabels } from '../core';
import { MahjongTile } from './MahjongTile';

export function MahjongPlayerPanel({ player, active, position }: { player: MahjongPlayerState; active: boolean; position: MahjongSeat }) {
  return (
    <section className={`mahjong-player player-${position} ${active ? 'active' : ''}`} aria-label={`${seatLabels[player.seat]}信息`}>
      <header><span>{seatLabels[player.seat]}</span><small>{player.concealedTiles.length} 张手牌</small></header>
      <div className="player-melds">
        {player.melds.length ? player.melds.map((meld) => <div className="meld" key={meld.claimedTileId}>{meld.tiles.map((tile) => <MahjongTile key={tile.tileId} tile={tile} compact />)}<small>{meld.type === 'chi' ? '吃' : '碰'}</small></div>) : <span className="meld-empty">暂无副露</span>}
      </div>
      <div className="player-discards">{player.discards.slice(-10).map((tile) => <MahjongTile key={tile.tileId} tile={tile} compact />)}</div>
    </section>
  );
}
