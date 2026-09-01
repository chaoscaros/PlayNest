import { ArrowLeft } from 'lucide-react';
import { Suspense } from 'react';
import { Link, useParams } from 'react-router-dom';
import { gameRegistry } from '../../platform/games/gameRegistry';
import { gameModuleRegistry } from '../../platform/games/gameModuleRegistry';

export function GamePlayPage() {
  const { gameId = '' } = useParams();
  const definition = gameRegistry.getById(gameId);
  const gameModule = gameModuleRegistry.getById(gameId);

  if (!definition || definition.status !== 'available' || !gameModule) {
    return <div className="page container not-found"><span className="error-code">NO PLAY</span><h1>这个游戏还不能开始</h1><p>返回大厅看看已经开放的内容。</p><Link className="button button-primary" to="/games"><ArrowLeft size={18} /> 返回游戏大厅</Link></div>;
  }

  const GameComponent = gameModule.GameComponent;
  return <Suspense fallback={<div className="game-loading" role="status"><span>PLAYNEST / LOADING</span><strong>正在摆好游戏组件…</strong></div>}><GameComponent /></Suspense>;
}
