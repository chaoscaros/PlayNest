# 技术决策

## ADR-001 — React + TypeScript + Vite

**状态：Accepted。** 长期页面与游戏 UI 需要成熟组件生态；Vite 提供轻量开发和构建，TypeScript strict 保持契约清晰。

## ADR-002 — 游客优先

**状态：Accepted。** 首次访问自动建立本地 Guest Profile，注册不是平台入口条件。当前使用 localStorage，未来再提供主动账号迁移。

## ADR-003 — 平台与游戏模块分离

**状态：Accepted。** Registry 只管理 metadata；游戏规则、state 与 actions 属于独立游戏模块。当前不实现插件 runtime。

## ADR-004 — 当前不实现 Server

**状态：Accepted。** 尚无确认游戏或真实联机需求，提前建立 WebSocket、数据库、Redis 会增加无效复杂度。只保留 Server Authoritative 目标文档。

## ADR-005 — 人类可读文本中文优先

**状态：Accepted。** 玩家文案和文档以简体中文为主，代码标识与内部 ID 使用英文。

## ADR-006 — 原生 CSS 设计系统

**状态：Accepted。** 当前组件规模不需要 UI framework；CSS Variables、单一全局样式入口和响应式断点足以提供独特、轻量的视觉。
