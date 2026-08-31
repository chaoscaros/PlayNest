# 架构

## Current Architecture

```text
React App
├── Router / AppShell
├── Pages
├── GuestProvider
├── Platform
│   ├── Game Registry + placeholder metadata
│   ├── Guest profile generation
│   └── versioned localStorage wrapper
└── CSS design system + responsive layouts
```

平台页面通过 `GameRegistry` 获取只读 metadata，通过 `GuestProvider` 使用身份、最近访问和设置。`PlatformStorage` 是 localStorage 唯一访问边界。当前没有游戏 runtime、全局复杂 store、API client 或服务端。

## Target Architecture

未来在用户确认后，每款游戏通过稳定 Plugin Contract 提供 entry、state、actions 和可选能力。正式账号、在线房间和 Server Authoritative Game Server 是独立的后续边界，不进入当前客户端骨架。

Current 与 Target 不得混作完成声明。
