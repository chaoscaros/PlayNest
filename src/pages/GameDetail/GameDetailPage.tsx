import { ArrowLeft, CalendarClock, Layers3, Users } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGuest } from '../../app/providers/useGuest';
import { GameVisual } from '../../components/games/GameVisual';
import { gameRegistry } from '../../platform/games/gameRegistry';
import { categoryLabels, playerModeLabels, statusLabels } from '../../platform/games/types';

export function GameDetailPage() {
  const { gameId = '' } = useParams();
  const game = gameRegistry.getById(gameId);
  const { recordGameVisit } = useGuest();

  useEffect(() => { if (game) recordGameVisit(game.id); }, [game, recordGameVisit]);

  if (!game) return <div className="page container not-found"><span className="error-code">404</span><h1>没有找到这个游戏</h1><p>它可能还没有加入 PlayNest，或者地址写错了。</p><Link className="button button-primary" to="/games"><ArrowLeft size={18} /> 返回游戏大厅</Link></div>;

  return (
    <div className="page container detail-page">
      <Link to="/games" className="back-link"><ArrowLeft size={17} /> 返回游戏大厅</Link>
      <div className="detail-layout">
        <GameVisual game={game} large />
        <div className="detail-copy">
          <span className="status-pill"><i />{statusLabels[game.status]}</span>
          <h1>{game.name}</h1><p className="detail-lead">{game.longDescription}</p>
          <div className="detail-facts">
            <div><Layers3 size={19} /><span><small>游戏分类</small><strong>{categoryLabels[game.category]}</strong></span></div>
            <div><Users size={19} /><span><small>玩家模式</small><strong>{playerModeLabels[game.playerMode]}</strong></span></div>
            <div><CalendarClock size={19} /><span><small>开放状态</small><strong>等待确认</strong></span></div>
          </div>
          <button className="button button-disabled" disabled>敬请期待</button>
          <p className="detail-note">这是平台体验占位，不包含任何实际游戏规则或可交互玩法。</p>
        </div>
      </div>
    </div>
  );
}
