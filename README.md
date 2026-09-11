# 青年劳动权益手册（newyoung）

面向青年打工人的劳动权益普法静态站：工资社保、离职竞业、租房避坑、退休养老金、维权渠道与工具箱（含工资条解读器）。

## 技术

- 纯静态：HTML + CSS + 原生 JS，**无构建步骤、无后端、无依赖**。
- 所有页面共用 `styles.css` / `nav.js` / `law.js` / `tools.js`。

## 部署（Cloudflare Pages · Git 自动部署）

在 Cloudflare Pages 连接本仓库后，构建设置：

- Framework preset：`None`
- Build command：（留空）
- Build output directory：`/`（仓库根即站点根，含 `index.html`）

每次 `git push` 到主分支即自动发布。

## 自定义域名

在 Cloudflare Pages 项目里绑定你的域名，并把 `robots.txt` 的 `Sitemap:` 与 `sitemap.xml` 里所有 `<loc>` 的域名同步改成最终域名。

## 本地预览

直接用浏览器打开 `index.html` 即可（部分浏览器对本地 `file://` 的 fetch 有限制，但本站无 fetch 调用，可正常打开）。
