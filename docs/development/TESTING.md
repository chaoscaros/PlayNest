# 测试

## 命令

```bash
npm run typecheck
npm run test
npm run build
npm run lint
```

Vitest 使用 jsdom。平台测试覆盖 Guest、Game Registry、Game Module Registry 和 PlatformStorage。

麻将 Core 测试覆盖：136 张 / 34 种 / 每种 4 张、座位与排序、发牌、出牌与越权、墙头普通摸牌、墙尾杠后补牌、吃碰、暗杠、明杠、加杠、连续杠、杠后胡与流局、胡牌解析、七对子与十三幺禁用、自摸、点胡、`胡 > 明杠 > 碰 > 吃` 响应优先级、过、牌墙耗尽、确定性和 136 张唯一实体守恒。AI 测试覆盖孤立字牌弃牌、胡优先、三种杠、碰、过和确定性出牌。UI 测试覆盖东家直接开局、14 张手牌、三家电脑身份、玩家固定下方、杠按钮、暗杠牌背、四张加杠牌面和出牌后自动转入 AI。

CSS 不追求单元测试覆盖率；响应式与最终视觉仍需通过真实浏览器在 375px、768px、1440px 验收。
