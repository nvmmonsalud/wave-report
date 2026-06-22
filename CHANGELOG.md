# Changelog

## v1.1.0 — 2026-06-22 — AI Surf Coach + live conditions 🤙

**Headline:** New `/api/coach` endpoint ranks your top 3 spots by skill, vibe, wave size, and crowd. Storm Glass live conditions flowing for Pipeline + Uluwatu.

### What's in
- **AI Surf Coach** — POST `/api/coach` with preferences, get ranked top 3 with score (0-100), headline, reasons, and warnings
- Heuristic engine works out of the box; Claude Haiku upgrade path via `ANTHROPIC_API_KEY`
- Skill level safety check (beginner → 3ft cap, pro → 30ft)
- 4 preference groups: skill level, wave size, vibe, crowd tolerance
- Color-coded results (emerald 80+, cyan 60+, amber 40+, rose <40)
- "Re-pick" button to go back to preferences

### Live conditions
- Pipeline: 1.04m waves, 26°C water, 5.56 m/s wind @ 75° (live ✓)
- Uluwatu: 1.5m, 28.6°C, 3.63 m/s @ 84° (live ✓)
- Malibu: still on mock fallback (Storm Glass may not have data for the exact Malibu point — coords updated to 34.0403, -118.6919)

### Fixes
- Malibu Surfrider coordinates: 34.0345, -118.6787 → 34.0403, -118.6919 (actual surf break)

### Build stats
- Build time: 24s
- TypeScript check: passed
- 7 routes now (added /api/coach)
- 35 deployment files

### Files
- New: `src/app/api/coach/route.ts` (7.5KB)
- New: `src/components/SurfCoach.tsx` (11KB)
- Modified: `src/app/api/conditions/route.ts` (Malibu coords)
- Modified: `src/app/page.tsx` (SurfCoach wired in + footer)
- Modified: `README.md` (API table)

---

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
