export type GameCategory = 'board' | 'puzzle' | 'casual';
export type PlayerMode = 'single' | 'local-multiplayer' | 'online-multiplayer';
export type GameStatus = 'coming-soon' | 'available' | 'maintenance';

export interface GameDefinition {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  category: GameCategory;
  playerMode: PlayerMode;
  status: GameStatus;
  accent: 'mint' | 'coral' | 'sky' | 'amber';
  featured?: boolean;
}

export const categoryLabels: Record<GameCategory, string> = {
  board: '棋牌',
  puzzle: '益智',
  casual: '休闲',
};

export const playerModeLabels: Record<PlayerMode, string> = {
  single: '单人',
  'local-multiplayer': '本地多人',
  'online-multiplayer': '在线多人',
};

export const statusLabels: Record<GameStatus, string> = {
  'coming-soon': '即将开放',
  available: '可以游玩',
  maintenance: '维护中',
};
