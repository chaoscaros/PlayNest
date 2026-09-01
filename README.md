# PlayNest

PlayNest 是一个打开浏览器即可探索的现代中文休闲游戏平台。游客无需注册即可浏览平台；当前第一款真实游戏为单人对战三名电脑的「基础麻将」。

## 技术栈

- React + TypeScript + Vite
- React Router
- Vitest + Testing Library
- 普通 CSS + CSS Variables
- Lucide 图标
- `react-riichi-mahjong-tiles` 彩色 SVG 麻将牌面

## 本地开发

```bash
npm install
npm run dev
npm run typecheck
npm run test
npm run build
npm run lint
```

开发服务优先使用 `http://127.0.0.1:9999`；如果端口被占用，Vite 会自动尝试后续可用端口。

AI / 新开发者首先阅读 [`AGENTS.md`](./AGENTS.md)，项目文档入口见 [`docs/README.md`](./docs/README.md)。

## 当前边界

`mahjong-basic` 已确认并处于 `available`，其他条目仍只是 `coming-soon` metadata。基础麻将没有杠、番、花牌或特殊胡型；平台仍没有账号、在线服务器、房间、匹配或数据库。
