---
title: 在 2 GB 内存的 Lightsail 上搭一个静态优先的站
description: 这个站自己的搭建记录:机器配置、选型理由和踩到的两个坑。
date: 2026-11-12
tags: [部署, astro, caddy]
---

这个站跑在一台 AWS Lightsail 实例上:2 vCPU、1.9 GB 内存、58 GB 磁盘,Ubuntu 24.04。这篇记录它是怎么搭起来的。

## 选型

内存是这台机器最硬的约束,所以原则是把计算挪到构建期,运行期只发静态文件。

| 组件 | 选择 | 理由 |
|---|---|---|
| Web 服务器 | Caddy | 一个二进制,配了域名就自动签发 HTTPS 证书 |
| 站点生成 | Astro | 默认输出纯 HTML,页面不带多余的 JavaScript |
| 文章 | Markdown 内容集合 | 带 schema 校验,frontmatter 写错会在构建时报错 |
| 后端 | 暂无 | 等出现第一个真正需要服务端的功能再加 |

## 两个坑

**没有 swap。** Lightsail 的 Ubuntu 镜像默认不带交换分区,前端构建的内存峰值可能撞上 OOM。先加一个 2 GB 的 swapfile:

```sh
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

**系统自带的 Node 太旧。** Ubuntu 24.04 的 apt 源里是 Node 18,已经停止维护,新版 Astro 也不支持。换成 NodeSource 源的 Node 22 之前,要先卸掉系统的 `nodejs`、`npm` 和 `libnode-dev`,否则包会冲突。

## 发布

构建产物同步到 Caddy 的站点目录即可,不需要重启任何进程:

```sh
npm run deploy
```
