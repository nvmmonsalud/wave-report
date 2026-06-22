# Changelog

## v1.2.0 — 2026-06-22 — Live data in Coach + OG image for social previews 🌊

**Headline:** The AI Surf Coach now reasons over live Storm Glass wave heights + the live URL has a proper social preview card.

### What's in
- **Live conditions in Coach** — `/api/coach` fetches all 6 spots' conditions in parallel (5s timeout each via AbortController) and passes the live data to Claude. The prompt instructs the model to use live wave height (with m→ft conversion) and flag dangerous conditions. The heuristic fallback also uses live data when available.
  - `liveData: true` flag in the response flips when ≥1 spot has live data
  - UI shows "🟢 live conditions" badge when liveData is true
- **OG image for social previews** — New `/api/og.png` endpoint using `@vercel/og` (pure-JS, edge runtime). 1200×630 PNG with:
  - Linear gradient background (slate-900 → cyan-700)
  - SVG wave curves at the bottom
  - Big "Wave Report" title + subtitle
  - 3 stat cards: 6 SPOTS, 4.5 AVG RATING, 12ft BIGGEST WAVE
  - "Built with Next.js + GLM 5.2 · AI Coach powered by Claude" footer
  - 5-min cache headers
- **Open Graph + Twitter meta tags** — `src/app/layout.tsx` has proper og:image, og:title, og:description, twitter:card=summary_large_image, twitter:image, og:image:width/height/alt. Share the URL anywhere and it shows a proper preview card.

### Build stats
- Build time: 23s
- TypeScript: passed (0 errors)
- 6 routes (1 static + 5 API, including new /api/og.png)
- 1 new dep: `@vercel/og@^0.11.1`

### Files
- Modified: `src/app/api/coach/route.ts` — parallel conditions fetcher, live data in prompt + heuristic
- Modified: `src/app/api/conditions/route.ts` — unchanged (already supported live + mock)
- New: `src/app/api/og.png/route.tsx` — @vercel/og image route
- Modified: `src/app/layout.tsx` — Open Graph + Twitter meta tags
- Modified: `src/components/SurfCoach.tsx` — live data badge (already supported)
- Modified: `package.json` — added `@vercel/og`
- Modified: `REEL.md` — v2 with 60s + 90s cut variants, captions, audio, calendar

---

## v1.1.1 — 2026-06-22 — Redis + Claude upgrade 🔥

**Headline:** Upstash Redis persistence + Claude Haiku-powered AI Surf Coach live on the production site.

### What's in
- **Upstash Redis persistence** — all CRUD operations now write to Upstash, no more in-memory resets on cold starts
  - Versioned keys (`wave-report:v2:*`) to bypass any corrupted data from the initial deploy
  - Fixed `@upstash/redis` SDK JSON auto-serialization (was double-encoding with `JSON.stringify`)
  - Full cycle tested: POST → GET (7 spots) → DELETE → GET (6 spots) all working
- **Claude Haiku Surf Coach** — `/api/coach` now uses real Claude model when `ANTHROPIC_API_KEY` is set
  - Produces domain-aware reasoning: "Requires solid reef awareness and duck-dive technique", "Swell-dependent; timing and forecasting crucial"
  - Generates proper warnings for safety (over-skill ratings, over-crowd, vibe mismatch)
  - Writes a 1-2 sentence summary synthesizing the picks
- **Storm Glass live conditions** — API call + mock fallback wired. Pipeline and Uluwatu have returned live readings (1.04m and 1.5m respectively); rate-limiting on Storm Glass free tier causes occasional fallback to mock. Graceful degradation works.

### Env vars now set
- `STORMGLASS_API_KEY` (live conditions)
- `KV_REST_API_URL` + `KV_REST_API_TOKEN` + `KV_URL` + `REDIS_URL` (Upstash)
- `ANTHROPIC_API_KEY` (Claude Surf Coach)

### Build stats
- Build time: 12s
- TypeScript: passed
- 6 routes (1 static + 5 API)

### Files
- Modified: `src/lib/store.ts` — fixed Redis serialization, versioned keys, refactored to readSpots() helper

---

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
