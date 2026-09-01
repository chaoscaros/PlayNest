import { lazy, type ComponentType } from 'react';

const MahjongGame = lazy(async () => {
  const gameModule = await import('../../games/mahjong-basic');
  return { default: gameModule.MahjongGame };
});

export interface GameModule {
  id: string;
  GameComponent: ComponentType;
}

export class GameModuleRegistry {
  private readonly modules: ReadonlyMap<string, GameModule>;

  constructor(modules: readonly GameModule[]) {
    const ids = modules.map((module) => module.id);
    if (new Set(ids).size !== ids.length) throw new Error('Game module IDs must be unique.');
    this.modules = new Map(modules.map((module) => [module.id, module]));
  }

  getById(id: string): GameModule | undefined {
    return this.modules.get(id);
  }
}

export const gameModuleRegistry = new GameModuleRegistry([{ id: 'mahjong-basic', GameComponent: MahjongGame }]);
