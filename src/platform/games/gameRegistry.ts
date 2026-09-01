import { gameCatalog } from './catalog';
import type { GameCategory, GameDefinition } from './types';

export class GameRegistry {
  private readonly games: ReadonlyMap<string, GameDefinition>;

  constructor(definitions: readonly GameDefinition[]) {
    const ids = definitions.map((game) => game.id);
    if (new Set(ids).size !== ids.length) {
      throw new Error('Game IDs must be unique.');
    }
    this.games = new Map(definitions.map((game) => [game.id, game]));
  }

  list(): GameDefinition[] {
    return [...this.games.values()];
  }

  getById(id: string): GameDefinition | undefined {
    return this.games.get(id);
  }

  getByCategory(category: GameCategory): GameDefinition[] {
    return this.list().filter((game) => game.category === category);
  }
}

export const gameRegistry = new GameRegistry(gameCatalog);
