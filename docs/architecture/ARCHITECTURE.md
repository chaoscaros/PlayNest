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
│       │   └── Seat-visible selector
│       └── UI
│           ├── Table / Hand / Tile
│           ├── Reaction Controls
│           └── Handoff / Result
└── CSS design system + responsive layouts
```

平台页面通过 `GameRegistry` 获取 metadata，通过 `GameModuleRegistry` 将可用游戏映射到 `/play/:gameId`。麻将 Core 不依赖 React、DOM、window、storage 或 CSS；UI 只派发 Action 并读取合法动作和座位可见状态。`PlatformStorage` 仍是 localStorage 唯一访问边界，牌局本身不持久化。当前没有全局复杂 store、API client 或服务端。

## Target Architecture

未来在用户确认后，每款游戏通过稳定 Plugin Contract 提供 entry、state、actions 和可选能力。正式账号、在线房间和 Server Authoritative Game Server 是独立的后续边界，不进入当前客户端骨架。

Current 与 Target 不得混作完成声明。
