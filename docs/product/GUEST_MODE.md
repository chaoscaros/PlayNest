# 游客模式

## 当前行为

首次打开时由浏览器 `crypto.randomUUID()` 生成 Guest ID，昵称格式为 `游客 0000`，同时记录 ISO 创建时间。完整资料存入 localStorage，刷新和重新打开浏览器后保持。

用户可以在个人页修改本地昵称（去除多余空白，最多 16 字符）。设置页可以重置全部平台数据；重置会删除原身份并立即生成新的 Guest ID，旧 ID 无法恢复。

## 存储

统一通过 `PlatformStorage` 访问 `playnest.platform-state`，页面和组件不直接读写 localStorage。数据包含 `storageVersion: 1`。

## 当前限制

没有云同步、跨浏览器恢复、注册、登录或 OAuth。清理浏览器数据也会丢失游客身份。

## 未来升级方向

未来可在用户主动注册时，将 Guest Profile、设置、最近访问及届时允许迁移的游戏数据交给账号迁移流程。客户端 Guest ID 不等于最终服务器 User ID。
