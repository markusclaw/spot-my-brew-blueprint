# spotmybrew

**Tier:** staged | **Status:** Initializing | **Created:** 2026-04-19

## Architecture

| Component | Technology | URL |
|-----------|-----------|-----|
| Frontend  | Next.js → Cloudflare Pages | https://spotmybrew.pages.dev |
| API       | Cloudflare Workers | https://spotmybrew-api.workers.dev |
| Database  | Cloudflare D1 (SQLite) | — |

## Structure

```
spotmybrew/
├── site/           # Next.js frontend (static export → CF Pages)
├── api/            # Cloudflare Workers API
│   ├── src/        # Worker source
│   └── migrations/ # D1 SQL migrations
├── spotmybrew.md # Living project spec
└── README.md
```

## Development

```bash
# Frontend
cd site && npm run dev

# API (local Workers dev server)
cd api && npm run dev

# Deploy frontend
cd site && npm run build && npx wrangler pages deploy out --project-name=spotmybrew

# Deploy API
cd api && npx wrangler deploy

# Run D1 migration (remote)
cd api && npm run db:migrate:prod
```

See `spotmybrew.md` for full project spec.
