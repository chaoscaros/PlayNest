# 排障手册

## 应用无法启动

确认 Node 与 npm 可用，运行 `npm install` 后执行 `npm run dev`，检查端口占用和 Vite 输出。

## 路由异常

检查 `src/app/router.tsx` 的 Route 与页面导入。生产部署必须把未知前端路径回退到 `index.html`。

## Guest 丢失

检查浏览器是否禁用 localStorage、是否清理站点数据，以及 `playnest.platform-state` 是否存在。隐私模式关闭后数据可能被浏览器删除。

## localStorage 数据损坏

`PlatformStorage.read()` 会对非法 JSON 或未知版本回退到空 v1 状态。可在设置中重置；不要让组件直接修补 raw storage。

## Game Registry 找不到游戏

确认 URL 的 `gameId` 与 `src/platform/games/catalog.ts` 一致。未知 ID 应显示中文“没有找到这个游戏”，不应抛出运行时错误。

## 移动端布局问题

检查 375px 视口、底部导航 safe-area、横向溢出和触控目标；同时验证 768px 与 1440px，避免只修一个断点。

## Production build 问题

依次运行 `npm run typecheck`、`npm run test`、`npm run build`。先修复 strict 类型和测试失败，再检查 Vite bundle 输出。

## 麻将操作被拒绝

检查当前 `phase`、`currentSeat` 和 `getLegalActions(state, seat)`。UI 只展示合法动作，但 Core 会再次验证 Tile ID、座位、响应队列和吃牌组合；不要绕过 `applyMahjongAction` 直接修改 State。

## 麻将牌数量异常

检查牌是否同时存在于隐藏手牌、牌墙、弃牌或副露。吃碰成功必须从出牌者弃牌区移除 claimed tile，再加入副露；任意状态下全部实体 Tile ID 应唯一且合计 136。

## 本地手牌泄露

只有点击换手遮罩后的 active seat 可以渲染完整手牌。其他座位只应展示数量、副露和弃牌；优先检查 `getVisibleStateForSeat` 与 `revealedSeat` UI 状态。
