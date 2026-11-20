---
title: Caddy 配 Cloudflare 橙色云:几个要对齐的设置
description: 源站用 Caddy 自动签证书,前面再套 Cloudflare 代理。哪些设置必须对齐,哪些默认行为容易误解。
date: 2026-11-17
tags: [caddy, cloudflare, https, 部署]
---

这个站的结构是:Cloudflare 代理(DNS 记录里的「橙色云」)→ 源站上的 Caddy → 静态文件。两边都能处理 HTTPS 和跳转,职责没分清就容易出问题。

## 先用灰色云签证书

Caddy 只要在配置里写上域名,就会自动向 Let's Encrypt 申请证书。第一次申请时,DNS 记录先设为「仅 DNS」(灰色云),让验证请求直接到达源站。

这次实测,DNS 生效后切换配置,两个域名的证书在 6 秒内签发完成。确认 HTTPS 正常之后,再把记录切成橙色云。

两步分开做的好处是排错简单:如果证书签不下来,问题只可能在源站和 DNS,不会和 Cloudflare 的设置搅在一起。

## SSL/TLS 模式:选「完全(严格)」

开了橙色云之后,访客连的是 Cloudflare,Cloudflare 再去连源站。Cloudflare 连源站的方式由 SSL/TLS 加密模式决定:

| 模式 | Cloudflare → 源站 | 配合 Caddy 的结果 |
|---|---|---|
| 灵活 | HTTP | Caddy 把 HTTP 跳转到 HTTPS,Cloudflare 又用 HTTP 去请求,**无限重定向** |
| 完全 | HTTPS,不校验证书 | 能用,但源站证书失效也察觉不到 |
| 完全(严格) | HTTPS,校验证书 | 推荐。Caddy 的证书是公开签发的,天然满足 |

「灵活」是最常见的坑:页面打不开,浏览器提示重定向次数过多。

## 「始终使用 HTTPS」:可以不开

Cloudflare 有个开关会把所有 HTTP 请求在边缘直接跳转到 HTTPS。但 Caddy 已经在做同样的事了,开不开对访客没有区别。

不开的理由在续期上:证书大约 60 天后要续,Caddy 续期时可能使用 HTTP 验证,验证请求需要能经过 80 端口到达源站。让 HTTP 请求原样透传到 Caddy,是最不容易出意外的做法。开了之后续期是否一定失败,我没有实测;但它不带来收益,保守起见就不开。

如果想彻底摆脱对 80 端口的依赖,可以改用 DNS 验证:给 Caddy 装上 Cloudflare 的 DNS 插件,用一个只有该域名 DNS 编辑权限的 API 令牌。代价是需要自定义构建 Caddy,升级也要跟着重新构建。

## 默认并不缓存 HTML

开了橙色云,不等于页面被 CDN 缓存了。用 `curl -I` 看响应头:

```text
server: cloudflare
cf-cache-status: DYNAMIC
cf-ray: …-SYD
```

`DYNAMIC` 表示这个请求没有被缓存,每次都回源。Cloudflare 默认只缓存按扩展名判断的静态资源,HTML 不在其中。这个站的 CSS 很小,构建时被直接内联进了 HTML,所以实际上没有任何东西被缓存。

这时橙色云带来的是隐藏源站 IP 和基础防护,而不是加速。要让 HTML 也被缓存,需要在 Cloudflare 里加一条缓存规则,代价是每次发布后要清缓存才能立刻看到更新。流量不大时,源站完全扛得住,可以以后再做。

## 怎么确认请求真的经过了 Cloudflare

本机 DNS 缓存可能还指向旧的源站 IP,这时访问看起来正常,其实绕过了 Cloudflare。看响应头里的 `server` 字段最直接:是 `cloudflare` 就经过了代理,是 `Caddy` 就是直连源站。

也可以强制指定 Cloudflare 的边缘 IP 来测试,不受本地缓存影响:

```sh
curl -sI --resolve example.com:443:<Cloudflare 边缘 IP> https://example.com/
```
