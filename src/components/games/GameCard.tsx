import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { categoryLabels, playerModeLabels, statusLabels, type GameDefinition } from '../../platform/games/types';
import { GameVisual } from './GameVisual';

export function GameCard({ game, compact = false }: { game: GameDefinition; compact?: boolean }) {
  return (
    <Link className={`game-card ${compact ? 'game-card-compact' : ''}`} to={`/games/${game.id}`} aria-label={`查看${game.name}详情`}>
      <GameVisual game={game} />
      <div className="game-card-body">
        <div className="game-card-kicker">
          <span>{categoryLabels[game.category]}</span>
          <span className="status-dot" />
          <span>{statusLabels[game.status]}</span>
        </div>
        <h3>{game.name}</h3>
        <p>{game.shortDescription}</p>
        <div className="game-card-footer">
          <span>{playerModeLabels[game.playerMode]}</span>
          <span className="card-arrow"><ArrowUpRight size={17} /></span>
        </div>
      </div>
    </Link>
  );
}
