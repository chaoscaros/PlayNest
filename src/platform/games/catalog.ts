import type { GameDefinition } from './types';

// 仅供平台布局与数据流验证；所有条目均未确认，也不包含任何游戏实现。
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
