<div align="center">

<img src="upload/logo.png" width="120" alt="Logo" />

# GithubStarsManager

**AI 驱动的 GitHub Stars 管理工具 — 同步、分类、搜索、追踪 Release。**

![数据](https://img.shields.io/badge/存储-100%25本地-success?style=flat&logo=database&logoColor=white)
![AI](https://img.shields.io/badge/AI-多模型支持-blue?style=flat&logo=openai&logoColor=white)
![平台](https://img.shields.io/badge/平台-Win%20%7C%20macOS%20%7C%20Linux-purple?style=flat&logo=electron&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat)

中文 | [English](README.md)

</div>

---

Star 了太多仓库，找不到了？GithubStarsManager 自动同步你的 Star 仓库，用 AI 生成摘要和分类，支持语义搜索。追踪 Release 更新，按平台筛选资源，一键下载。

## 功能

- **自动同步** — 通过 GitHub Token 拉取所有 Star 仓库
- **AI 分析** — 自动生成描述、标签和分类
- **语义搜索** — 按意图搜索，不依赖精确关键词
- **Release 时间线** — 订阅仓库，在一个时间线里查看所有新版本
- **智能筛选** — 按系统、架构、文件类型筛选资源
- **一键下载** — 展开并直接下载 Release 资源
- **WebDAV 备份** — 通过坚果云、Nextcloud 或任意 WebDAV 服务同步数据（含AI分析结果和分类）
- **双语 Wiki** — 根据仓库语言跳转 Deepwiki（英文）或 Zread（中文）
- **跨设备同步** — 可选后端服务，多设备共享数据
- **桌面客户端** — 下载即用，无需配置环境

## 快速开始

### 桌面客户端（推荐）

从 [Releases](https://github.com/AmintaCCCP/GithubStarsManager/releases) 下载。

### Docker

```bash
docker compose up -d --build
# 访问 http://localhost:8080
```

### 源码运行

```bash
npm install
npm run dev
```

### 后端服务（可选）

```bash
cd server && npm install && npm run dev
```

后端提供跨设备同步、免 CORS 的 API 代理和加密 Token 存储。不部署后端时，所有数据存在浏览器 IndexedDB + localStorage 中（双写保障，关闭标签页不丢数据）。

| 变量 | 必填 | 说明 |
|------|------|------|
| `API_SECRET` | 否 | API 认证 Bearer Token |
| `ENCRYPTION_KEY` | 否 | AES-256 加密密钥 |

## AI 配置

支持多种 AI 提供商，在设置面板中配置：

- **OpenAI**（GPT-3.5 / GPT-4）
- **Anthropic**（Claude）
- **Ollama**（本地模型，无需 API Key）
- **任意 OpenAI 兼容 API**（自定义端点 + Key）

## 截图

| 仓库管理 | Release 时间线 | 发现 |
|---------|---------------|------|
| ![仓库](upload/repo.png) | ![Release](upload/release.png) | ![发现](upload/discovery.png) |

| 搜索 | 设置 | AI 配置 |
|------|------|---------|
| ![搜索](upload/search.png) | ![设置](upload/settings.png) | ![AI](upload/ai.png) |

## 技术栈

React 18 · TypeScript · Tailwind CSS · Zustand · Vite · Electron · Express · SQLite

## 部署

### Docker（推荐）
```bash
docker compose up -d --build
```

### 静态托管
构建产物是纯静态站点，可部署到 Netlify、Vercel、Cloudflare Pages、GitHub Pages 或任意 HTTP 服务器：
```bash
npm run build  # 输出: dist/
```

### 反向代理
将域名指向 `http://127.0.0.1:8080` 即可，无需特殊 Header 配置。

## 适合谁

- Star 了几百上千个仓库的开发者
- 需要系统性追踪工具 Release 的人
- 想要 AI 自动整理、不想手动打标签的懒人

## 参与贡献

1. Fork 仓库
2. 创建分支 (`git checkout -b feature/xxx`)
3. 提交并推送
4. 发起 Pull Request

## 许可证

[MIT](LICENSE)

## Star 趋势

[![Star History](https://api.star-history.com/svg?repos=AmintaCCCP/GithubStarsManager&type=Date)](https://www.star-history.com/#AmintaCCCP/GithubStarsManager&Date)
