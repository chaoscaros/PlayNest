import type { GameDefinition } from './types';

export const mahjongBasicDefinition: GameDefinition = {
  id: 'mahjong-basic',
  name: '基础麻将',
  shortDescription: '你坐东家，对战三名电脑的简化四人麻将。',
  longDescription: 'PlayNest 基础麻将是一套自包含的简化推倒胡规则。你固定坐东家，与南、西、北三名电脑对局；它不对应任何完整地区规则。',
  category: 'board',
  playerMode: 'single',
  status: 'available',
  accent: 'mint',
  featured: true,
  rules: ['单人对战三名基础 AI', '136 张牌，无花牌', '支持吃、碰、胡与过', '无杠、无番、无特殊胡型', '四组面子加一对将即可胡'],
};

// 以下条目仅供平台布局与数据流验证，均未确认，也不包含游戏实现。
export const placeholderGames: readonly GameDefinition[] = [
  {
    id: 'quiet-board-room',
    name: '静谧棋室',
    shortDescription: '留给经典棋类的安静一隅。',
    longDescription: '这是用于展示平台结构的棋牌分类占位页，具体玩法仍等待确认。',
    category: 'board',
    playerMode: 'local-multiplayer',
    status: 'coming-soon',
    accent: 'mint',
    featured: true,
  },
  {
    id: 'daily-brainwave',
    name: '每日灵感',
    shortDescription: '几分钟就能投入的轻量挑战。',
    longDescription: '这是益智分类的内容占位，用来验证搜索、分类与最近访问功能。',
    category: 'puzzle',
    playerMode: 'single',
    status: 'coming-soon',
    accent: 'amber',
    featured: true,
  },
  {
    id: 'sofa-duo',
    name: '沙发双人局',
    shortDescription: '为同屏分享快乐预留的位置。',
    longDescription: '这是本地多人分类的概念占位，不包含棋盘、规则或可操作游戏。',
    category: 'casual',
    playerMode: 'local-multiplayer',
    status: 'coming-soon',
    accent: 'coral',
  },
  {
    id: 'cloud-table',
    name: '云上同乐',
    shortDescription: '未来与远方朋友相聚的入口。',
    longDescription: '这是在线多人能力的展示占位。房间、匹配与服务器当前均未实现。',
    category: 'casual',
    playerMode: 'online-multiplayer',
    status: 'coming-soon',
    accent: 'sky',
  },
];

export const gameCatalog: readonly GameDefinition[] = [mahjongBasicDefinition, ...placeholderGames];
