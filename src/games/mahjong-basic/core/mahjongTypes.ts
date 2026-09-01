export type MahjongSuit = 'characters' | 'bamboo' | 'dots';
export type MahjongRank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type MahjongHonor = 'east' | 'south' | 'west' | 'north' | 'red-dragon' | 'green-dragon' | 'white-dragon';
export type MahjongTileType = `${MahjongSuit}-${MahjongRank}` | MahjongHonor;

export interface MahjongTileInstance {
  tileId: number;
  tileType: MahjongTileType;
}

export type MahjongSeat = 'east' | 'south' | 'west' | 'north';
export type MahjongMeldType = 'chi' | 'pung' | 'concealed-kong' | 'exposed-kong' | 'added-kong';
export type MahjongPhase = 'awaiting-discard' | 'awaiting-reaction' | 'ended';
export type MahjongWinType = 'self-draw' | 'discard-win';
export type MahjongGameStatus = 'playing' | 'won' | 'draw';
export type MahjongReactionType = 'hu' | 'exposed-kong' | 'pung' | 'chi';

export interface MahjongMeld {
  type: MahjongMeldType;
  tiles: MahjongTileInstance[];
  fromSeat: MahjongSeat;
  claimedTileId: number | null;
}

export interface MahjongPlayerState {
  seat: MahjongSeat;
  concealedTiles: MahjongTileInstance[];
  melds: MahjongMeld[];
  discards: MahjongTileInstance[];
}

export interface MahjongDiscard {
  seat: MahjongSeat;
  tile: MahjongTileInstance;
}

export interface MahjongReaction {
  seat: MahjongSeat;
  type: MahjongReactionType;
  chiOptions?: number[][];
}

export interface MahjongReactionState {
  discard: MahjongDiscard;
  queue: MahjongReaction[];
}

export interface MahjongState {
  players: Record<MahjongSeat, MahjongPlayerState>;
  wall: MahjongTileInstance[];
  initialWall: MahjongTileInstance[];
  dealerSeat: 'east';
  currentSeat: MahjongSeat;
  phase: MahjongPhase;
  lastDiscard: MahjongDiscard | null;
  reactionState: MahjongReactionState | null;
  winner: MahjongSeat | null;
  winType: MahjongWinType | null;
  status: MahjongGameStatus;
  actionCount: number;
}

export type MahjongAction =
  | { type: 'discard-tile'; seat: MahjongSeat; tileId: number }
  | { type: 'declare-hu'; seat: MahjongSeat }
  | { type: 'declare-concealed-kong'; seat: MahjongSeat; tileIds: number[] }
  | { type: 'claim-exposed-kong'; seat: MahjongSeat }
  | { type: 'declare-added-kong'; seat: MahjongSeat; meldClaimedTileId: number; tileId: number }
  | { type: 'claim-pung'; seat: MahjongSeat }
  | { type: 'claim-chi'; seat: MahjongSeat; tileIds: number[] }
  | { type: 'pass-reaction'; seat: MahjongSeat };

export type MahjongLegalAction =
  | { type: 'discard-tile' }
  | { type: 'declare-hu'; winType: MahjongWinType }
  | { type: 'declare-concealed-kong'; tileIds: number[]; tileType: MahjongTileType }
  | { type: 'claim-exposed-kong'; tileType: MahjongTileType }
  | { type: 'declare-added-kong'; meldClaimedTileId: number; tileId: number; tileType: MahjongTileType }
  | { type: 'claim-pung' }
  | { type: 'claim-chi'; tileIds: number[] }
  | { type: 'pass-reaction' };

export interface MahjongVisiblePlayer {
  seat: MahjongSeat;
  concealedCount: number;
  concealedTiles?: MahjongTileInstance[];
  melds: MahjongMeld[];
  discards: MahjongTileInstance[];
}

export interface MahjongVisibleState {
  viewerSeat: MahjongSeat;
  players: Record<MahjongSeat, MahjongVisiblePlayer>;
  wallCount: number;
  currentSeat: MahjongSeat;
  phase: MahjongPhase;
  lastDiscard: MahjongDiscard | null;
  winner: MahjongSeat | null;
  winType: MahjongWinType | null;
  status: MahjongGameStatus;
}
