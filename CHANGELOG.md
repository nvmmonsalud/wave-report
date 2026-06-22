# Changelog

## v1.0.0 — 2026-06-22 — Public release 🌊

**Headline:** Built in 1 hour with GLM 5.2 via Hermes Agent. Live demo: [wave-report-ten.vercel.app](https://wave-report-ten.vercel.app)

### What's in
- Full-stack Next.js 16 + React 19 + TypeScript + Tailwind v4
- 6 surf spots pre-loaded (Pipeline, Uluwatu, Mundaka, Jefferies Bay, Malibu, Cowells)
- Stats dashboard (total spots, avg rating, biggest wave, dominant vibe)
- Filter by vibe (5 options) and crowd (5 levels), sort by rating/wave/name
- Full-text search across name, location, notes
- Live conditions via Storm Glass API (with mock fallback)
- CRUD API: GET/POST `/api/spots`, GET/PATCH/DELETE `/api/spots/[id]`
- Toast notifications for add/delete/rate
- Glassmorphism cards with color-coded gradients per vibe
- Animated wave background
- Persistent storage via Upstash Redis (in-memory fallback)
- Deployed to Vercel production in 24 seconds
- Source: github.com/nvmmonsalud/wave-report

### Build stats
- Build time: 4.8s
- TypeScript check: 3.6s
- 6 routes generated (1 static, 3 API, 1 dynamic, 1 not-found)
- 30 deployment files
- Deploy region: iad1 (Washington, D.C.)
- Build cache: restored from prior deploy

### What's next
- Optional: add `STORMGLASS_API_KEY` env var to flip conditions from mock → live
- Optional: add Upstash Redis integration for persistence across cold starts
- Future: AI Surf Coach (use model to recommend best spot per preference)
- Reel script: see [REEL.md](./REEL.md)
