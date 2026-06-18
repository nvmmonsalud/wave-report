import { SurfSpot, SurfSpotInput, Stats, Vibe } from "@/types";
import { Redis } from "@upstash/redis";

// Detect if Upstash Redis env vars are present
const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = kvUrl && kvToken ? new Redis({ url: kvUrl, token: kvToken }) : null;
export const hasRedis = !!redis;

const SPOTS_KEY = "wave-report:spots";
const COUNTER_KEY = "wave-report:counter";

// In-memory fallback store (seed data)
const seedSpots: SurfSpot[] = [
  {
    id: "1",
    name: "Pipeline",
    location: "Oahu, Hawaii",
    waveHeight: 12,
    crowdLevel: "crowded",
    vibe: "gnarly",
    rating: 5,
    notes: "Heavy barreling waves over shallow reef. Pros only.",
    createdAt: new Date("2026-06-10T08:00:00Z").toISOString(),
  },
  {
    id: "2",
    name: "Malibu Surfrider",
    location: "Malibu, California",
    waveHeight: 4,
    crowdLevel: "crowded",
    vibe: "fun",
    rating: 4,
    notes: "Long right-handers, perfect for longboarding. Watch the crowd.",
    createdAt: new Date("2026-06-11T10:30:00Z").toISOString(),
  },
  {
    id: "3",
    name: "Uluwatu",
    location: "Bali, Indonesia",
    waveHeight: 6,
    crowdLevel: "moderate",
    vibe: "epic",
    rating: 5,
    notes: "World-class left reef break. Stunning cliff backdrop.",
    createdAt: new Date("2026-06-12T06:00:00Z").toISOString(),
  },
  {
    id: "4",
    name: "Mundaka",
    location: "Basque Country, Spain",
    waveHeight: 8,
    crowdLevel: "light",
    vibe: "pumping",
    rating: 5,
    notes: "River-mouth left that can get perfect. Swell-dependent.",
    createdAt: new Date("2026-06-13T09:15:00Z").toISOString(),
  },
  {
    id: "5",
    name: "Jefferies Bay",
    location: "Eastern Cape, South Africa",
    waveHeight: 10,
    crowdLevel: "light",
    vibe: "epic",
    rating: 5,
    notes: "Legendary right-hand point break. Long, fast walls.",
    createdAt: new Date("2026-06-14T07:45:00Z").toISOString(),
  },
  {
    id: "6",
    name: "Cowells Beach",
    location: "Santa Cruz, California",
    waveHeight: 2,
    crowdLevel: "moderate",
    vibe: "chill",
    rating: 3,
    notes: "Perfect beginner wave. Gentle rolling rights.",
    createdAt: new Date("2026-06-15T11:00:00Z").toISOString(),
  },
];

// In-memory state for fallback
let memSpots = [...seedSpots];
let memCounter = 100;

async function ensureSeeded(): Promise<void> {
  if (!redis) return;
  const exists = await redis.exists(SPOTS_KEY);
  if (!exists) {
    await redis.set(SPOTS_KEY, JSON.stringify(seedSpots));
    await redis.set(COUNTER_KEY, 100);
  }
}

export async function getAllSpots(): Promise<SurfSpot[]> {
  if (redis) {
    await ensureSeeded();
    const data = await redis.get<string>(SPOTS_KEY);
    const spots: SurfSpot[] = data ? JSON.parse(data) : [];
    return [...spots].sort((a, b) => b.rating - a.rating);
  }
  return [...memSpots].sort((a, b) => b.rating - a.rating);
}

export async function getSpotById(id: string): Promise<SurfSpot | undefined> {
  const spots = await getAllSpots();
  return spots.find((s) => s.id === id);
}

export async function addSpot(input: SurfSpotInput): Promise<SurfSpot> {
  if (redis) {
    await ensureSeeded();
    const counter = await redis.incr(COUNTER_KEY);
    const newSpot: SurfSpot = {
      ...input,
      id: String(counter),
      createdAt: new Date().toISOString(),
    };
    const data = await redis.get<string>(SPOTS_KEY);
    const spots: SurfSpot[] = data ? JSON.parse(data) : [];
    spots.push(newSpot);
    await redis.set(SPOTS_KEY, JSON.stringify(spots));
    return newSpot;
  }
  const newSpot: SurfSpot = {
    ...input,
    id: String(++memCounter),
    createdAt: new Date().toISOString(),
  };
  memSpots.push(newSpot);
  return newSpot;
}

export async function updateSpot(
  id: string,
  input: Partial<SurfSpotInput>
): Promise<SurfSpot | undefined> {
  if (redis) {
    await ensureSeeded();
    const data = await redis.get<string>(SPOTS_KEY);
    const spots: SurfSpot[] = data ? JSON.parse(data) : [];
    const idx = spots.findIndex((s) => s.id === id);
    if (idx === -1) return undefined;
    spots[idx] = { ...spots[idx], ...input };
    await redis.set(SPOTS_KEY, JSON.stringify(spots));
    return spots[idx];
  }
  const idx = memSpots.findIndex((s) => s.id === id);
  if (idx === -1) return undefined;
  memSpots[idx] = { ...memSpots[idx], ...input };
  return memSpots[idx];
}

export async function deleteSpot(id: string): Promise<boolean> {
  if (redis) {
    await ensureSeeded();
    const data = await redis.get<string>(SPOTS_KEY);
    const spots: SurfSpot[] = data ? JSON.parse(data) : [];
    const filtered = spots.filter((s) => s.id !== id);
    if (filtered.length === spots.length) return false;
    await redis.set(SPOTS_KEY, JSON.stringify(filtered));
    return true;
  }
  const before = memSpots.length;
  memSpots = memSpots.filter((s) => s.id !== id);
  return memSpots.length < before;
}

export async function getStats(): Promise<Stats> {
  const spots = await getAllSpots();

  if (spots.length === 0) {
    return {
      totalSpots: 0,
      averageRating: 0,
      bestWave: null,
      mostCommonVibe: null,
      averageWaveHeight: 0,
    };
  }

  const totalRating = spots.reduce((sum, s) => sum + s.rating, 0);
  const totalWaveHeight = spots.reduce((sum, s) => sum + s.waveHeight, 0);
  const best = spots.reduce(
    (best, s) => (s.waveHeight > best.waveHeight ? s : best),
    spots[0]
  );

  const vibeCounts = new Map<Vibe, number>();
  spots.forEach((s) =>
    vibeCounts.set(s.vibe, (vibeCounts.get(s.vibe) || 0) + 1)
  );
  const mostCommonVibe =
    Array.from(vibeCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ??
    null;

  return {
    totalSpots: spots.length,
    averageRating: Math.round((totalRating / spots.length) * 10) / 10,
    bestWave: { name: best.name, height: best.waveHeight },
    mostCommonVibe,
    averageWaveHeight: Math.round((totalWaveHeight / spots.length) * 10) / 10,
  };
}
