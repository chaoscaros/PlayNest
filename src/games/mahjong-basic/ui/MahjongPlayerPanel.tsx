import type { MahjongPlayerState } from '../core';
import { seatLabels } from '../core';
import { MahjongTile } from './MahjongTile';

export type MahjongTablePosition = 'top' | 'right' | 'bottom' | 'left';

const meldLabels = {
  chi: '吃',
  pung: '碰',
  'concealed-kong': '暗杠',
  'exposed-kong': '明杠',
  'added-kong': '加杠',
} as const;

export function MahjongPlayerPanel({ player, active, position, computer }: { player: MahjongPlayerState; active: boolean; position: MahjongTablePosition; computer: boolean }) {
  const identity = computer ? '电脑' : '你';
  return (
    <section className={`mahjong-player player-${position} ${active ? 'active' : ''}`} aria-label={`${seatLabels[player.seat]}${identity}信息`}>
      <header><span>{seatLabels[player.seat]} <i>{identity}</i></span><small>{player.concealedTiles.length} 张手牌</small></header>
      <div className="player-melds">
        {player.melds.length ? player.melds.map((meld) => <div className="meld" key={meld.claimedTileId ?? meld.tiles[0].tileId}>{meld.tiles.map((tile) => <MahjongTile key={tile.tileId} tile={tile} compact faceDown={meld.type === 'concealed-kong'} />)}<small>{meldLabels[meld.type]}</small></div>) : <span className="meld-empty">暂无副露</span>}
      </div>
      <div className="player-discards">{player.discards.slice(-10).map((tile) => <MahjongTile key={tile.tileId} tile={tile} compact />)}</div>
    </section>
  );
}
