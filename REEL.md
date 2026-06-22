# 🎬 Wave Report — Reel Assets v2

> **Updated 2026-06-22** with 60s and 90s cut variants, plus caption pack, audio list, and posting calendar. Frame screenshots are in the `/frames/` subfolder.

---

## 🎞️ The 60s Cut (original — clean & tight)

**Hook:** A surf spot looks gnarly in the photo, but the AI coach says different.

### Beat 1 — Setup (0:00-0:04)
**Overlay:** `BUILT A SURF APP IN 1 HOUR`
**Subtitle:** `with a model nobody tested`
**Visual:** Black screen → split: wave on left, terminal on right
**Audio:** Wave crash on cut

### Beat 2 — The model (0:04-0:09)
**Overlay:** `🌊 GLM 5.2`
**Subtitle:** `the one nobody had tried`
**Visual:** Terminal showing `model: glm-5.2` config → Hermes prompt firing
**Audio:** Sub bass

### Beat 3 — Timer (0:09-0:14)
**Overlay:** `60:00 ⏱️`
**Subtitle:** `... go`
**Visual:** Stopwatch starting from 60:00
**Audio:** Snare hit

### Beat 4-8 — Build montage (0:14-0:34)
**Overlay (rotating):**
- `→ setup next.js 16`
- `→ react 19 + tailwind v4`
- `→ glassmorphism cards`
- `→ live conditions API`
- `→ ship it.`
**Visual:** Quick screen-records: `npm run dev` → blank → app → API JSON → `vercel --prod` → green check
**Audio:** Each beat lands on the hi-hat; build montage gets faster

### Beat 9 — Deploy reveal (0:34-0:42)
**Overlay:** `🌊 wave-report-ten.vercel.app`
**Subtitle:** `deployed in 24 seconds`
**Visual:** Live demo page loading, surf spots filling in, stats counting up
**Audio:** Big synth swell

### Beat 10 — THE FLIP (0:42-0:50) ← the money shot
**Overlay:** `Pipeline: 12ft · gnarly`
**Subtitle:** `looks gnarly... but conditions say 5ft`
**Visual:** Click Pipeline card → live conditions animate in → wave height is 5ft at 16° water → vibe softens
**Audio:** Record scratch

### Beat 11 — Lesson (0:50-0:56)
**Overlay:** `vibe ≠ conditions`
**Subtitle:** `always check the data`
**Visual:** Switch between two cards: gnarly with mellow, chill with pumping
**Audio:** Resolution

### Beat 12 — CTA (0:56-1:00)
**Overlay:** `🌊 TRY IT`
**Subtitle:** `link in bio`
**Visual:** URL `wave-report-ten.vercel.app` filling screen, animated wave
**Audio:** Final wave crash

---

## 🎞️ The 90s Cut (extended — AI Coach is the centerpiece)

**Hook:** "I built an AI surf coach that actually checks the conditions."

### Beat 1 — Setup (0:00-0:05)
**Overlay:** `BUILT AN AI SURF COACH`
**Subtitle:** `in 1 hour. with a model nobody tested.`
**Visual:** Black → split: wave on left, terminal on right
**Audio:** Wave crash

### Beat 2 — Model (0:05-0:10)
**Overlay:** `🌊 GLM 5.2`
**Subtitle:** `the one nobody had tried`
**Visual:** Terminal `model: glm-5.2` → Hermes firing
**Audio:** Sub bass

### Beat 3 — Timer (0:10-0:14)
**Overlay:** `60:00 ⏱️`
**Subtitle:** `... go`
**Visual:** Stopwatch
**Audio:** Snare

### Beat 4-7 — Build montage (0:14-0:34)
**Overlay (rotating):**
- `→ next.js 16 + react 19`
- `→ storm glass live API`
- `→ upstash redis`
- `→ claude AI coach`
- `→ ship to vercel`
**Visual:** Screen-records of each layer
**Audio:** Builds in tempo

### Beat 8 — Live deploy (0:34-0:42)
**Overlay:** `🌊 wave-report-ten.vercel.app`
**Subtitle:** `deployed in 24s. live in 60s.`
**Visual:** Live page loading
**Audio:** Synth swell

### Beat 9 — The AI Coach opens (0:42-0:48) ← new beat
**Overlay:** `AI SURF COACH`
**Subtitle:** `tell me your level. I'll rank the top 3.`
**Visual:** Click "AI Surf Coach" button → panel expands → preference groups visible
**Audio:** Click sound + pad

### Beat 10 — Set prefs (0:48-0:54) ← new beat
**Overlay:** `INTERMEDIATE`
**Subtitle:** `any wave · any vibe · any crowd`
**Visual:** Click skill=inter, all=any across all groups → button activates
**Audio:** Tap on each click

### Beat 11 — THE MONEY SHOT — Coach results (0:54-1:06) ← Frame 3 lives here
**Overlay:** `TOP 3 PICKS`
**Subtitle:** `live data · claude-powered reasoning`
**Visual:** Click "Find My Top 3 Spots" → result panel animates in:
- #1 Uluwatu — 95 (emerald)
- #2 Malibu Surfrider — 95 (emerald)
- #3 Cowells Beach — 90 (cyan)
**Audio:** Reveal synth + clock ticking down to silence

### Beat 12 — The flip (1:06-1:14) ← doubled weight
**Overlay:** `Pipeline: 12ft · gnarly`
**Subtitle:** `looks gnarly... but live data says 1m`
**Visual:** Click Pipeline card → live conditions badge appears (real Storm Glass data) → wave height much smaller than static claim
**Audio:** Record scratch

### Beat 13 — Lesson (1:14-1:22)
**Overlay:** `vibe ≠ conditions`
**Subtitle:** `always check the live data`
**Visual:** Same as 60s but with the live badge clearly visible
**Audio:** Resolution

### Beat 14 — CTA (1:22-1:30)
**Overlay:** `🌊 TRY IT`
**Subtitle:** `wave-report-ten.vercel.app`
**Visual:** URL filling screen, animated wave
**Audio:** Final wave crash + cymbal wash

---

## 🖼️ Key Frame Library

These are the screenshot moments the Reels are built around. **In the dev server at `http://localhost:3503`** (or live at `wave-report-ten.vercel.app`):

| Frame | What to capture | Used in |
|---|---|---|
| **1-hero** | Stats dashboard + AI Coach button collapsed | Beat 1 (60s), Beat 8 (90s) |
| **2-prefs** | AI Coach expanded, all 4 preference groups visible | Beat 9-10 (90s) |
| **3-results** | Top 3 picks with scores (95, 95, 90) | Beat 11 (90s) — THE MONEY SHOT |
| **4-conditions** | Pipeline card with live conditions expanded | Beat 10/12 (both cuts) |
| **5-mobile** | Full page on mobile viewport (375px) | Optional cut for Shorts/Reels mobile-first audiences |
| **6-build** | Terminal showing `vercel --prod` green check | Build montage (both cuts) |

**How to re-capture:**
1. `cd ~/Projects/wave-report && PORT=3503 npm run dev` (background)
2. Open `http://localhost:3503` in your browser
3. Use Cmd+Shift+4 to select-window screenshot
4. Name them `frame-1-hero.png` etc, drop in this folder

---

## 📝 Caption Pack (4 platforms)

### Instagram Reel
> 🌊 I built a full-stack surf spot rater in 1 hour using GLM 5.2 — a brand new model I hadn't tested.
>
> It runs on Next.js 16, fetches live wave conditions via Storm Glass, persists to Upstash Redis, and has a Claude-powered AI coach that ranks your top 3 spots based on your skill level.
>
> The biggest lesson: **vibe ≠ conditions**. A spot that *looks* gnarly might be mellow right now. A "chill" spot could be pumping. Always check the data.
>
> Try it → link in bio (wave-report-ten.vercel.app)
>
> #vibecoding #nextjs #surfing #ai #glm5.2 #buildinpublic #vercel #claude #opengoogle

### TikTok
> POV: you vibe-coded an AI surf coach in 60 minutes and it actually works 🌊
>
> Built with a brand-new GLM 5.2 model nobody had tested. Live wave data, persistent storage, Claude reasoning. Link in bio.
>
> #vibecoding #ai #buildinpublic #nextjs

### YouTube Shorts
> **Title:** I built an AI Surf Coach in 1 hour with a model nobody tested
>
> **Description:** Wave Report — a full-stack surf spot rater built in 60 minutes using GLM 5.2 (a model I had zero experience with). Live wave conditions from Storm Glass, persistent storage via Upstash Redis, and a Claude-powered AI coach that ranks your top 3 spots by skill level + vibe + crowd tolerance.
>
> The twist: looks ≠ conditions. A "gnarly" spot might be 1m today. A "chill" spot might be 8ft offshore. The coach catches what photos can't.
>
> Try it: https://wave-report-ten.vercel.app
>
> 0:00 Setup
> 0:05 The model
> 0:10 The timer
> 0:14 Build montage
> 0:34 Deploy
> 0:42 The flip
>
> #vibecoding #nextjs #surfing #ai #buildinpublic

### X / Twitter (thread starter)
> 🌊 I built a full-stack surf spot rater in 1 hour with GLM 5.2 — a model I had zero experience with.
>
> It runs on Next.js 16, fetches live wave conditions, persists to Upstash, has a Claude-powered AI coach.
>
> The twist: looks ≠ conditions. The AI catches what photos can't. 1/5
>
> [link to Reel]

---

## 🎵 Audio Search List

Search these on **Pixabay Music** (free, no attribution) or **Epidemic Sound** (if you have a sub):

| Mood | Search terms | Use in |
|---|---|---|
| **Chill lo-fi surf** | "surf lofi", "beach chill", "tropical lofi" | Whole Reel, slow tempo |
| **Build montage** | "coding beat", "indie tech", "creative process" | Beats 4-8 (both cuts) |
| **Reveal synth** | "epic reveal", "drop moment", "satisfying reveal" | Beat 9 (60s) / 8 (90s) |
| **Dramatic tension** | "mystery hit", "cinematic tension" | Beat 10 (60s) / 12 (90s) — the flip |
| **Resolution** | "uplifting resolve", "happy ending beat" | Beat 11 (60s) / 13 (90s) |
| **Outro wash** | "ambient wave", "ocean fadeout" | Beat 12 (60s) / 14 (90s) |

**Recommended picks for the 90s cut:**
- **Track:** "Sunset Drive" by Pixabay Music (royalty-free)
- **Backup:** "Coding Flow" by Infraction (CC-BY)
- **Original:** Ocean wave SFX + lo-fi beat (record your own)

---

## 📅 Posting Calendar

### Day 0 (launch day)
- **Instagram Reel** (primary) — post 9-10am your local time (peak Reel engagement)
- Pin to profile grid
- Add to Stories with "NEW POST" sticker

### Day 0+2 hours
- **TikTok** (cross-post same file) — TikTok algorithm rewards same-day cross-posts
- Add #vibecoding #buildinpublic #nextjs to description

### Day 0+6 hours
- **X thread** (4-5 tweets) — link the Reel + share 3 key insights
- Engage with replies for 1-2 hours (algorithm boost)

### Day 1 (24h later)
- **YouTube Shorts** (re-upload) — different thumbnail (use Frame 3 — the money shot)
- Add to a "Build in Public" playlist

### Day 3
- **X follow-up thread** — share 1-2 technical details (Storm Glass rate limits, Claude coach reasoning quality)
- Tag @vercel @claudeai @stormglassio for reach

### Day 7
- **Reddit** — post in r/surfing, r/nextjs, r/LocalLLaMA, r/InternetIsBeautiful
- Honest "what worked, what didn't" post
- Selfie/community first, promo second

### Day 14
- **LinkedIn** — long-form post: "What I learned shipping an AI surf coach in 1 hour with GLM 5.2"
- Different angle — entrepreneur / product / AI-augmented-coding audience

---

## 🏄 Final Checklist Before You Record

- [ ] Live URL `wave-report-ten.vercel.app` works (curl returns 200)
- [ ] AI Coach gives Claude-powered results (not just heuristic)
- [ ] Live conditions work for at least Pipeline (real Storm Glass data)
- [ ] OG image renders correctly at /api/og.png (post-v1.2.0 deploy)
- [ ] Reel assets folder has all 6 frame screenshots
- [ ] 2 audio tracks downloaded
- [ ] Captions saved in a notes file
- [ ] Camera/screen-recording software ready (OBS, Loom, or native)
- [ ] Coffee ☕

🤙 That's a complete launch kit. Go ship.
