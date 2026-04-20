# spotmybrew

**Tier:** staged
**Owner:** TBD
**Status:** Initializing
**Created:** 2026-04-19

---

## What It Is
[Description TBD]

## Problem It Solves
[TBD]

## Team
- Greg — [role TBD]

## Stack
- Frontend: Next.js, TypeScript, Tailwind CSS v4 → Cloudflare Pages
- Backend: Cloudflare Workers (TypeScript)
- Database: Cloudflare D1 (SQLite)
- Auth: [TBD — JWT on Workers or Lucia Auth]
- Deploy: Pages (frontend) + Workers (API) + D1 (database)

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────┐
│   site/          │────▶│   api/           │────▶│  D1 Database │
│   (Pages)        │     │   (Workers)      │     │  (SQLite)    │
│   Static Next.js │     │   REST API       │     │              │
└─────────────────┘     └──────────────────┘     └─────────────┘
  spotmybrew.pages.dev      spotmybrew-api.workers.dev    spotmybrew-db
```

- Frontend is statically exported Next.js, deployed to Cloudflare Pages
- API runs on Cloudflare Workers, handles all backend logic
- D1 is the database (SQLite-compatible, serverless)
- Frontend calls API via fetch; CORS configured on Workers

## Infrastructure

| Component | Resource | URL/ID |
|-----------|----------|--------|
| Frontend  | CF Pages project | https://spotmybrew.pages.dev |
| API       | CF Worker | https://spotmybrew-api.workers.dev |
| Database  | CF D1 | spotmybrew-db |
| Repo      | GitHub | github.com/markusclaw/spotmybrew |

## Design Decisions
- 2026-04-19 — Project initialized via Sophi New Project Protocol
- 2026-04-19 — Cloudflare full-stack: Pages + Workers + D1

## Current Goals (v1)
- [ ] [TBD]

## Future Goals (v2+)
- [ ] [TBD]

## Open Questions
- [TBD]

## History
- 2026-04-19 — Project initiated via Sophi New Project Protocol (init-sophi-project.sh)
