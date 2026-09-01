# AI 交接

## 当前阶段

Phase 2 第一款游戏交付：平台 UI 已通过用户首次确认，PlayNest 基础麻将已作为第一款真实游戏接入，等待用户试玩规则与 UI。

## 当前可运行状态

`npm install && npm run dev` 会优先在 `http://127.0.0.1:9999` 启动，端口占用时自动递补。平台现有 1 款真实游戏：`mahjong-basic`。用户可从大厅进入详情和游戏，四人共享设备完成摸打、吃、碰、胡、过、流局与再来一局。遵照用户要求，本轮未自行启动开发服务。

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
- Game Module Registry 与 `/play/:gameId` 通用游戏入口。
- PlayNest 基础麻将：136 张唯一实体牌、固定东家、四人发牌与确定性 Action/State Core。
- 普通四面子一将胡牌解析、吃碰胡合法动作、`胡 > 碰 > 吃` 响应队列。
- 四人共享设备、换手遮罩、其他玩家手牌隐藏、真实彩色 SVG 麻将牌面和响应式桌面。

## 部分完成

- 插件协议的 metadata + module entry 已落地；在线能力仍只在目标文档中规划。
- 可访问性已覆盖语义标签、键盘 focus、表单 label、文字状态与 reduced motion，未进行完整 WCAG 审计。

## 尚未实现

麻将杠、花牌、番型、算分、特殊胡型、AI、牌局保存、在线麻将、账号与云同步、WebSocket、房间、匹配、聊天、好友、排行榜、数据库和后台系统。

## 最近工作

2026-09-01 实现第一款真实游戏 PlayNest 基础麻将，并首次落地 Game Module Contract；根据试玩反馈将文字牌面替换为完整彩色 SVG 牌面。

当前静态验证：`npm run typecheck` PASS；`npm run test` PASS（10 files / 51 tests）；`npm run build` PASS；`npm run lint` PASS。牌面专项测试确认 34 种 Tile Type 全部渲染对应 SVG；构建已将麻将模块拆为独立 chunk，平台入口不携带麻将 SVG。运行时使用用户已启动的 `localhost:9999` 标签页确认桌面和 375px 手机端显示真实牌面、无文字回退且无页面级横向溢出；本轮未自行启动开发服务。

根据用户反馈取消 9999 端口的强制锁定：仍以 9999 为首选，端口占用时自动递补。

开发工具链将 TypeScript 固定为 6.0.3，避免不同包管理器把 `latest` 解析为 typescript-eslint 尚不支持的 7.0。

## 重要文件

- `src/app/router.tsx`：平台路由。
- `src/platform/games/`：metadata 类型、占位目录与 Registry。
- `src/platform/guest/`：游客身份生成与昵称规范化。
- `src/platform/storage/`：版本化本地数据。
- `src/styles/global.css`：设计 tokens、页面和响应式样式。
- `src/platform/games/gameModuleRegistry.ts`：真实游戏模块入口注册。
- `src/games/mahjong-basic/core/`：麻将 Tile、State、Action、Reaction、Solver 与可见状态。
- `src/games/mahjong-basic/ui/`：本地桌面、手牌、换手和操作 UI。
- `src/games/mahjong-basic/ui/mahjongTileArtwork.ts`：Tile Type 到 SVG 牌面的唯一映射。
- `docs/development/THIRD_PARTY_NOTICES.md`：视觉依赖来源与许可证署名。
- `docs/planning/GPT_PLANNING_BRIEF.md`：长期稳定方向。

## 已知问题

暂无静态或运行时验证发现的阻塞问题。开发过程中曾有一条路由热更新失败日志，完整刷新后路由与页面正常；其他占位游戏仍未确认。

## 技术债

- 数据版本仍为 v1，尚无 migration；版本不匹配时安全回退。
- 尚未配置可重复运行的浏览器端 E2E 测试；当前已有核心、React Testing Library 测试与一轮人工浏览器验收。

## 无明确理由不要修改

不要将注册设为前置条件，不要把未确认占位改为 `available`，不要把麻将规则移入 React，不要提前加入杠、番、AI、联机或其他游戏。

## 推荐下一任务

等待用户试玩基础麻将后决定下一阶段。
