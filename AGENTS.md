## 本项目

ryanho.cc.cd 的源码:Astro 静态站,由同一台服务器上的 Caddy 提供。
本目录(服务器 `~/sites/agent-notes`)是正本,也是 GitHub 仓库 `TVTRayray/ryanhoSite` 的工作区。

### 改完必须做的事

1. 本地验证:`npm run build` 通过。
2. 发布:`npm run deploy`(构建并同步到 `/var/www/agent-notes`,无需重启)。
3. 提交并推送:`git add -A && git commit -m "<说明>" && git push`。
   本仓库已配置专用部署密钥(`core.sshCommand`),直接 `git push` 即可。
   推送前先 `git pull --rebase`,别人可能从其他地方推过改动。

### 约定

- 仓库是**公开的**:不要提交服务器 IP、密钥、令牌或 `.env`。源站 IP 由 Cloudflare 代理隐藏。
- `Caddyfile` 是线上配置的副本。改它之后:`caddy validate --config Caddyfile --adapter caddyfile`,
  再 `sudo cp Caddyfile /etc/caddy/Caddyfile && sudo systemctl reload caddy`。
- 文章在 `src/content/posts/*.md`,frontmatter 由 `src/content.config.ts` 校验。
- 站点颜色全部用 `src/styles/global.css` 里 `light-dark()` 定义的变量;主题切换靠 `<html data-theme>`。
- `src/figures/*.html` 由 `npm run figures` 生成,不要手改。

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
