# 架构

## Current Architecture

```text
React App
├── Router / AppShell
├── Pages
├── GuestProvider
├── Platform
│   ├── Game Registry + metadata
│   ├── Game Module Registry + play route
│   ├── Guest profile generation
│   └── versioned localStorage wrapper
├── Games
│   └── mahjong-basic
│       ├── Core
│       │   ├── Tile Model / Tile Set
│       │   ├── Game State / Actions
│       │   ├── Legal Actions / Reactions
│       │   ├── Hand Solver
│       │   ├── Kong Rules / Replacement Draw
│       │   └── Seat-visible selector
│       ├── AI
│       │   ├── Acting-seat controller
│       │   └── Deterministic action / discard policy
│       └── UI
│           ├── Table / Hand / Tile Surface
│           ├── SVG Tile Artwork Adapter
│           ├── Reaction Controls
│           └── Player Perspective / AI Status / Result
└── CSS design system + responsive layouts
```

平台页面通过 `GameRegistry` 获取 metadata，通过 `GameModuleRegistry` 将可用游戏懒加载到 `/play/:gameId`，游戏实现与视觉资源不进入平台首屏 bundle。进入 `/play/` 后 `AppShell` 切换为全屏游戏会话：隐藏平台 Header、Footer 与移动导航，由游戏内部提供返回、标题和规则入口，避免平台 chrome 挤占牌桌空间。麻将 Core 不依赖 React、DOM、window、storage 或 CSS；UI 只派发 Action 并读取合法动作和座位可见状态。Core 明确区分墙头普通摸牌与墙尾杠后补牌，三种杠均复用现有 Action/State 和副露模型。单人 AI 也是 Core 外的纯策略层，只使用合法动作与自己手牌选择 Action，由 UI 定时调度，不绕过 Core。桌面位置与规则座位分离：玩家东家固定显示在下方，南家在右、西家在上、北家在左，不改变 Core 的座次顺序。麻将 UI 通过本地 adapter 将 34 种业务 Tile Type 映射为第三方 SVG 牌面，Core 不知道资源包的存在。`PlatformStorage` 仍是 localStorage 唯一访问边界，牌局本身不持久化。当前没有全局复杂 store、API client 或服务端。

## Target Architecture

未来在用户确认后，每款游戏通过稳定 Plugin Contract 提供 entry、state、actions 和可选能力。每款游戏可以引入与其物件匹配的 SVG、图片或专用视觉包；跨游戏的按钮、弹层、棋子容器等只有出现真实复用时才上提为平台 UI primitive。正式账号、在线房间和 Server Authoritative Game Server 是独立的后续边界，不进入当前客户端骨架。

Current 与 Target 不得混作完成声明。
