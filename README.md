<div align="center">

<img src="upload/logo.png" width="120" alt="Logo" />

# GithubStarsManager

**AI-powered GitHub Stars manager — sync, categorize, search, and track releases.**

![Data](https://img.shields.io/badge/Storage-100%25_Local-success?style=flat&logo=database&logoColor=white)
![AI](https://img.shields.io/badge/AI-Multi--Model-blue?style=flat&logo=openai&logoColor=white)
![Platform](https://img.shields.io/badge/Platform-Win%20%7C%20macOS%20%7C%20Linux-purple?style=flat&logo=electron&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat)

[中文文档](README_zh.md) | English

</div>

---

Star too many repos, can't find anything? GithubStarsManager syncs your starred repositories, uses AI to generate summaries and categories, and lets you search by meaning — not just keywords. Track releases, filter assets by platform, and download with one click.

## Features

- **Auto Sync** — Pull all starred repos with a GitHub token
- **AI Analysis** — Generate descriptions, tags, and categories automatically
- **Semantic Search** — Find repos by intent, not exact names
- **Release Timeline** — Subscribe to repos, see new versions in one feed
- **Smart Filters** — Filter assets by OS, architecture, file type
- **One-click Download** — Expand and download release assets directly
- **WebDAV Backup** — Sync data via Jianguoyun, Nextcloud, or any WebDAV server
- **Bilingual Wiki** — Jump to Deepwiki (EN) or Zread (ZH) per repo
- **Cross-device Sync** — Optional backend for sharing data across devices
- **Desktop Client** — Download and run, no setup needed

## Quick Start

### Desktop (Recommended)

Download from [Releases](https://github.com/AmintaCCCP/GithubStarsManager/releases).

### Docker

```bash
docker compose up -d --build
# Open http://localhost:8080
```

### From Source

```bash
npm install
npm run dev
```

### With Backend Server (Optional)

```bash
cd server && npm install && npm run dev
```

The backend adds cross-device sync, CORS-free API proxying, and encrypted token storage. Without it, everything runs in browser localStorage.

| Variable | Required | Description |
|----------|----------|-------------|
| `API_SECRET` | No | Bearer token for API auth |
| `ENCRYPTION_KEY` | No | AES-256 key for stored secrets |

## AI Configuration

Supports multiple providers — configure in Settings:

- **OpenAI** (GPT-3.5 / GPT-4)
- **Anthropic** (Claude)
- **Ollama** (local models, no API key)
- **Any OpenAI-compatible API** (custom endpoint + key)

## Screenshots

| Stars | Releases | Discover |
|-------|----------|----------|
| ![Stars](upload/repo.png) | ![Releases](upload/release.png) | ![Discover](upload/discovery.png) |

| Search | Settings | AI Config |
|--------|----------|-----------|
| ![Search](upload/search.png) | ![Settings](upload/settings.png) | ![AI](upload/ai.png) |

## Tech Stack

React 18 · TypeScript · Tailwind CSS · Zustand · Vite · Electron · Express · SQLite

## Deployment

### Docker (Recommended)
```bash
docker compose up -d --build
```

### Static Hosting
Build output is a static site — deploy to Netlify, Vercel, Cloudflare Pages, GitHub Pages, or any HTTP server:
```bash
npm run build  # output: dist/
```

### Reverse Proxy
Point your domain to `http://127.0.0.1:8080`. No special headers needed.

## Who It's For

- Developers with hundreds of starred repos
- People who track tool releases systematically
- Anyone who wants AI-organized stars without manual tagging

## Contributing

1. Fork the repo
2. Create a branch (`git checkout -b feature/xxx`)
3. Commit and push
4. Open a Pull Request

## License

[MIT](LICENSE)

## Star History

[![Star History](https://api.star-history.com/svg?repos=AmintaCCCP/GithubStarsManager&type=Date)](https://www.star-history.com/#AmintaCCCP/GithubStarsManager&Date)
