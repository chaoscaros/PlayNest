import { CircleDot, Grid3X3, Sparkles, Users } from 'lucide-react';
import type { GameDefinition } from '../../platform/games/types';

const icons = { board: CircleDot, puzzle: Grid3X3, casual: Users } as const;

export function GameVisual({ game, large = false }: { game: GameDefinition; large?: boolean }) {
  const Icon = icons[game.category] ?? Sparkles;
  return (
    <div className={`game-visual visual-${game.accent} ${large ? 'game-visual-large' : ''}`} aria-hidden="true">
      <span className="visual-orbit visual-orbit-one" />
      <span className="visual-orbit visual-orbit-two" />
      <Icon className="visual-icon" strokeWidth={1.5} />
      <span className="visual-index">{game.id.slice(0, 2).toUpperCase()}</span>
    </div>
  );
}
