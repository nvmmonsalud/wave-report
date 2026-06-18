import { SurfSpot, SurfSpotInput, Stats, Vibe } from "@/types";

// In-memory data store — seed with rad surf spots
let spots: SurfSpot[] = [
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

let counter = 100;

export function getAllSpots(): SurfSpot[] {
  return [...spots].sort((a, b) => b.rating - a.rating);
}

export function getSpotById(id: string): SurfSpot | undefined {
  return spots.find((s) => s.id === id);
}

export function addSpot(input: SurfSpotInput): SurfSpot {
  const newSpot: SurfSpot = {
    ...input,
    id: String(++counter),
    createdAt: new Date().toISOString(),
  };
  spots.push(newSpot);
  return newSpot;
}

export function updateSpot(id: string, input: Partial<SurfSpotInput>): SurfSpot | undefined {
  const idx = spots.findIndex((s) => s.id === id);
  if (idx === -1) return undefined;
  spots[idx] = { ...spots[idx], ...input };
  return spots[idx];
}

export function deleteSpot(id: string): boolean {
  const before = spots.length;
  spots = spots.filter((s) => s.id !== id);
  return spots.length < before;
}

export function getStats(): Stats {
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
  const best = spots.reduce((best, s) => (s.waveHeight > best.waveHeight ? s : best), spots[0]);

  const vibeCounts = new Map<Vibe, number>();
  spots.forEach((s) => vibeCounts.set(s.vibe, (vibeCounts.get(s.vibe) || 0) + 1));
  const mostCommonVibe = Array.from(vibeCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  return {
    totalSpots: spots.length,
    averageRating: Math.round((totalRating / spots.length) * 10) / 10,
    bestWave: { name: best.name, height: best.waveHeight },
    mostCommonVibe,
    averageWaveHeight: Math.round((totalWaveHeight / spots.length) * 10) / 10,
  };
}
