export type CrowdLevel = "empty" | "light" | "moderate" | "crowded" | "packed";
export type Vibe = "chill" | "fun" | "pumping" | "gnarly" | "epic";

export interface SurfSpot {
  id: string;
  name: string;
  location: string;
  waveHeight: number; // in feet
  crowdLevel: CrowdLevel;
  vibe: Vibe;
  rating: number; // 1-5
  notes: string;
  createdAt: string;
}

export type SurfSpotInput = Omit<SurfSpot, "id" | "createdAt">;

export interface Stats {
  totalSpots: number;
  averageRating: number;
  bestWave: { name: string; height: number } | null;
  mostCommonVibe: Vibe | null;
  averageWaveHeight: number;
}
