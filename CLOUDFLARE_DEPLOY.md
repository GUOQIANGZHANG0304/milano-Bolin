# Cloudflare 部署说明

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
