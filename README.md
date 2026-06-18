# 🌊 Wave Report — Surf Spot Rater

A full-stack Next.js app for rating surf spots, tracking vibes, and finding your next wave.

Built with **GLM 5.2** via Hermes Agent to test the model's coding capabilities.

## ✨ Features

- **CRUD surf spots** — Add, view, rate, and delete surf breaks
- **Stats dashboard** — Total spots, avg rating, biggest wave, dominant vibe
- **Filter & sort** — Filter by vibe/crowd level, sort by rating/wave height/name
- **Ocean-themed UI** — Glassmorphism cards, animated wave background, color-coded vibes
- **Fully responsive** — Looks great on mobile, tablet, and desktop

## 🛠 Tech Stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **API Routes** for the backend (in-memory data store)
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

## 🏄 Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repo
4. Click **Deploy** — zero config needed!

## 🤙 Built By

GLM 5.2 + Hermes Agent · One-hour full-stack build challenge
