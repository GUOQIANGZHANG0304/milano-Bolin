# Cloudflare 部署说明

## 设置管理员密码

部署后，在 Cloudflare 控制台进入 **Workers & Pages → milano-bolin → Settings → Variables and Secrets**，添加加密 Secret：

- 变量名：`ADMIN_PASSWORD`
- 值：设置一个不少于 12 位、只有管理员知道的强密码

保存后重新部署，然后访问 `/admin`。管理员登录有效期为 12 小时，可在后台点击“退出登录”。不要把真实密码写进 GitHub 或 `wrangler.jsonc`。

每次 Cloudflare 部署前会自动应用尚未执行的 D1 迁移。本次更新会为菜品表增加 `is_published` 字段，用于控制菜品是否在前台展示。

## Workers Builds 设置

- Build command: `npm run build`
- Deploy command: `npm run deploy`
- Root directory: 留空（仓库根目录）

## D1 数据库

- 数据库名称：`bolin-restaurant`
- Worker 绑定名称：`DB`
- 数据库 ID：`af930d06-1090-42f1-9588-2e220f71e159`

网站第一次部署完成后，在 Cloudflare 控制台或本地终端执行一次：

```bash
npm run db:migrate:remote
```

该命令会把 `drizzle` 目录中的菜品表结构应用到远程 D1 数据库。

## 地址

- 首页：`/`
- 菜单：`/menu`
- 后台：`/admin`

正式公开前应为 `/admin` 增加管理员身份验证。
