# 🌊 Wave Report — Surf Spot Rater

> 🟢 **Live demo:** [wave-report-ten.vercel.app](https://wave-report-ten.vercel.app) · Built in 1 hour with GLM 5.2 · Deployed on Vercel

A full-stack Next.js app for rating surf spots, tracking vibes, and finding your next wave.

Built with **GLM 5.2** via Hermes Agent to test the model's coding capabilities.

## ✨ Features

- **CRUD surf spots** — Add, view, rate, and delete surf breaks
- **Stats dashboard** — Total spots, avg rating, biggest wave, dominant vibe
- **Filter & sort** — Filter by vibe/crowd level, sort by rating/wave height/name
- **Search** — Full-text search across spot names, locations, and notes
- **Live conditions** — Wave height, water temp, wind speed per spot (Storm Glass API)
- **Toast notifications** — Visual feedback for add/delete/rate actions
- **Ocean-themed UI** — Glassmorphism cards, animated wave background, color-coded vibes
- **Fully responsive** — Looks great on mobile, tablet, and desktop
- **Persistent storage** — Upstash Redis with in-memory fallback

## 🛠 Tech Stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **API Routes** for the backend
- **Upstash Redis** for data persistence (with in-memory fallback)
- **Storm Glass API** for live surf conditions (with mock fallback)
- **Vercel** for deployment

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/spots` | Get all spots + stats |
| `POST` | `/api/spots` | Create a new spot |
| `GET` | `/api/spots/[id]` | Get a single spot |
| `PATCH` | `/api/spots/[id]` | Update a spot |
| `DELETE` | `/api/spots/[id]` | Delete a spot |
| `GET` | `/api/conditions?name=Pipeline` | Get live conditions for a spot |

## 🔑 Environment Variables (Optional)

The app works out of the box with in-memory storage and mock conditions. Add these for production features:

```env
# Upstash Redis — for data persistence across serverless cold starts
KV_REST_API_URL=your_upstash_url
KV_REST_API_TOKEN=your_upstash_token

# Storm Glass API — for live surf conditions
# Get a free key at https://stormglass.io
STORMGLASS_API_KEY=your_api_key
```

## 🏄 Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repo
4. (Optional) Add Upstash Redis integration from Vercel Marketplace
5. (Optional) Add `STORMGLASS_API_KEY` env var
6. Click **Deploy** — zero config needed!

## 🤙 Built By

GLM 5.2 + Hermes Agent · One-hour full-stack build challenge
