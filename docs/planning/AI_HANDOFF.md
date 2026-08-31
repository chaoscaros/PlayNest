# AI 交接

## 当前阶段

Phase 0 / Phase 1 基础交付：平台骨架、响应式 UI、游客体系和 metadata 目录已经实现，等待用户人工确认 UI / UX。

## 当前可运行状态

`npm install && npm run dev` 会优先在 `http://127.0.0.1:9999` 启动 React SPA；9999 被占用时 Vite 自动递补到后续可用端口。路由、游客身份、本地持久化、搜索分类、详情访问记录、昵称修改、主题和重置均已接入。静态验证已经执行；遵照用户要求，最终修复后的浏览器运行时验收等待用户启动服务后再执行。

## 已实现

- React + TypeScript + Vite 严格模式工程和 React Router。
- `/`、`/games`、`/games/:gameId`、`/profile`、`/settings`、`/about` 与 404。
- Guest ID、自动昵称、创建时间、昵称编辑、刷新持久化和重置新身份。
- 带 `storageVersion: 1` 的 PlatformStorage、损坏数据安全回退和最近访问。
- Game Registry 的列表、ID 查询、分类查询；4 个纯展示 `coming-soon` 占位。
- 搜索、分类、空状态、浅色/深色/跟随系统主题。
- 375px、768px、1440px 响应式布局及移动底部导航。
- Game Registry、Guest 和 Storage 自动化测试。
- 分层项目文档。

## 部分完成

- 游戏插件协议与在线架构仅为目标文档，尚无运行时代码，这是当前阶段的预期状态。
- 可访问性已覆盖语义标签、键盘 focus、表单 label、文字状态与 reduced motion，未进行完整 WCAG 审计。

## 尚未实现

任何实际游戏、账号与云同步、在线服务器、WebSocket、房间、匹配、聊天、好友、排行榜、数据库和后台系统。

## 最近工作

2026-08-31 从空仓库建立 PlayNest 平台第一版。严格保留“0 款实际游戏”的产品边界。

最终静态验证：`npm run typecheck` PASS；`npm run test` PASS（3 files / 14 tests）；`npm run build` PASS；`npm run lint` PASS。浏览器曾启动检查并发现滚动 effect 错误，代码已修复；应用户要求停止服务，修复后的运行时复验未执行。

根据用户反馈取消 9999 端口的强制锁定：仍以 9999 为首选，端口占用时自动递补。

开发工具链将 TypeScript 固定为 6.0.3，避免不同包管理器把 `latest` 解析为 typescript-eslint 尚不支持的 7.0。

## 重要文件

- `src/app/router.tsx`：平台路由。
- `src/platform/games/`：metadata 类型、占位目录与 Registry。
- `src/platform/guest/`：游客身份生成与昵称规范化。
- `src/platform/storage/`：版本化本地数据。
- `src/styles/global.css`：设计 tokens、页面和响应式样式。
- `docs/planning/GPT_PLANNING_BRIEF.md`：长期稳定方向。

## 已知问题

暂无静态验证发现的阻塞问题。占位游戏名称未获用户确认，不应解释为首发列表。修复 React 滚动 effect 后尚未进行浏览器复验（用户要求由其启动服务）。

## 技术债

- 数据版本仍为 v1，尚无 migration；版本不匹配时安全回退。
- 尚未配置浏览器端 E2E 测试，当前依赖单元测试与人工运行时验收。

## 无明确理由不要修改

不要将注册设为前置条件，不要把任何占位改为 `available`，不要添加假“开始游戏”入口，不要提前建立服务器或复杂状态库，不要开发具体游戏。

## 推荐下一任务

等待用户人工确认游戏平台 UI / UX；根据反馈调整平台后再决定下一阶段。不要自动开始具体游戏开发。
