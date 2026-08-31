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
