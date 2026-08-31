# 在线架构

**Status: Planned**。本文只描述目标方向，当前没有任何在线服务器实现。

```text
Browser
  │ WebSocket
  ▼
Game Server
  ├── Room
  ├── Match
  ├── Game Session
  └── Authoritative Game Logic
```

未来在线游戏优先采用 Server Authoritative：玩家发送 Game Action，服务器验证、修改 Game State 并向房间广播。客户端不能成为比赛结果的唯一权威。

未来议题包括 WebSocket、Room、Match、Reconnect、Server Authority、Spectator、Replay 与 Action 协议；目前全部未实现。当前不建立 NestJS、Fastify、数据库、Redis 或 Docker Compose。
