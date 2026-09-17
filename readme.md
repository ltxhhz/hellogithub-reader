# HelloGitHub Reader

> 一个基于官方 Markdown 的 HelloGitHub 静态浏览站。

> 由于我总是访问不了官方站，所以自己部署一个

HelloGitHub Reader 将 [HelloGitHub](https://github.com/521xueweihan/HelloGitHub) 月刊的 Markdown 内容通过 [VitePress](https://vitepress.dev/) 构建为纯静态站点。你可以在浏览器中流畅地浏览每一期月刊，并使用本地全文搜索快速定位感兴趣的开源项目。整个项目无后端、无数据库、无需任何 Token，构建产物可直接部署到任意静态托管服务。

## ✨ 特性

- **📖 完整月刊浏览** — 按期刊顺序组织，支持侧边栏快速跳转。
- **🔍 本地全文搜索** — 基于 MiniSearch，在浏览器端运行，无需外部搜索服务。
- **🔑 零 Token 依赖** — 不调用 GitHub API，不受速率限制影响。
- **📦 纯静态部署** — 使用 CDN 模式构建后，可托管在 GitHub Pages、Netlify、Vercel 等平台。
- **⚡ 轻量快速** — VitePress 默认零 JavaScript 运行时，页面加载极快。

## 🚀 快速开始

### 环境要求

- Node.js 18 或更高版本
- npm / pnpm / yarn（任选其一）

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
mkdir source && cd source
git clone --depth 1 https://github.com/521xueweihan/HelloGitHub.git
git clone --depth 1 https://github.com/521xueweihan/img_logo.git
git clone --depth 1 https://github.com/521xueweihan/img.git
git clone --depth 1 https://github.com/521xueweihan/img2.git
git clone --depth 1 https://github.com/521xueweihan/img3.git
git clone --depth 1 https://github.com/521xueweihan/img4.git
cd ..
node scripts/build.mjs
npm run docs:dev
```

启动后访问 `http://localhost:5173` 即可预览。

### 构建静态站点

确保已经按照上面的本地开发步骤准备好 `source/HelloGitHub` 后，再执行：

```bash
node scripts/build.mjs
npm run docs:build
```

构建产物位于 `docs/.vitepress/dist`。

### 本地预览构建结果

```bash
npm run docs:preview
```

## 📚 内容更新

本站内容来源于 HelloGitHub 官方仓库的 `content/` 目录。已完成本地开发环境配置时，重新拉取仓库并构建：

```bash
git -C source/HelloGitHub pull --ff-only
git -C source/img_logo pull --ff-only
git -C source/img pull --ff-only
git -C source/img2 pull --ff-only
git -C source/img3 pull --ff-only
git -C source/img4 pull --ff-only
node scripts/build.mjs
npm run docs:build
```

本地构建默认使用本地图片资源。GitHub Pages 和其他不需要本地图片副本的部署环境，使用 jsDelivr 模式：

```bash
git -C source/HelloGitHub pull --ff-only
node scripts/build.mjs --resource=jsdelivr
npm run docs:build
```

`--resource=jsdelivr` 会将图片地址替换为 `cdn.jsdelivr.net`，图片仓库不需要克隆到本地。资源版本按上游仓库的 `master` 分支使用。

## 🗂️ 项目结构

```
.
├── docs/
│   ├── .vitepress/
│   │   └── config.ts          # VitePress 配置（导航、搜索、侧边栏）
│   ├── HelloGitHub01.md       # 第 1 期月刊
│   ├── HelloGitHub02.md       # 第 2 期月刊
│   └── ...
├── package.json
├── scripts/
│   └── build.mjs
├── .github/
│   └── workflows/
│       └── deploy.yml
└── readme.md
```


### 侧边栏自动生成

项目使用 `vite-plugin-vitepress-auto-sidebar` 自动扫描 `docs/` 目录下的 Markdown 文件并生成侧边栏，新增月刊后无需手动修改配置。

## 🌐 部署

将 `docs/.vitepress/dist` 目录部署到任意静态托管平台即可。以下是一些常见选择：

| 平台 | 部署方式 |
|---|---|
| GitHub Pages | 使用 GitHub Actions 构建并发布 |
| Netlify | 构建命令 `node scripts/build.mjs --resource=jsdelivr && npm run docs:build`，发布目录 `docs/.vitepress/dist` |
| Vercel | 构建命令 `node scripts/build.mjs --resource=jsdelivr && npm run docs:build`，输出目录 `docs/.vitepress/dist` |
| 任意静态服务器 | 将 `docs/.vitepress/dist` 目录内容上传至服务器根目录 |

## GitHub Actions 自动更新与部署

项目已配置 `.github/workflows/deploy.yml`，用于自动拉取最新的 HelloGitHub 内容并部署到 GitHub Pages。

- 每月 28 日 06:00 UTC 自动执行
- 支持在 GitHub Actions 页面手动触发
- `main` 分支的站点配置或构建脚本发生变化时自动执行
- 图片资源使用 jsDelivr CDN，不打包进 Pages 构建产物

GitHub Pages 构建使用：

```bash
node scripts/build.mjs --resource=jsdelivr
npm run docs:build
```

启用部署前，需要在仓库的 **Settings > Pages** 中将发布来源设置为 **GitHub Actions**。

## 🙏 致谢

- [HelloGitHub](https://github.com/521xueweihan/HelloGitHub) — 所有月刊内容的来源，感谢作者及贡献者的持续付出。
- [VitePress](https://vitepress.dev/) — 优秀的静态站点生成器。

## 📄 License

本项目代码以 [MIT](https://opensource.org/licenses/MIT) 许可发布。  
月刊内容版权归 HelloGitHub 项目所有，请遵循原项目的许可协议。

---

**HelloGitHub Reader** — 让浏览开源月刊回归简单。
