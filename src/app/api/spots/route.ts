import { NextRequest, NextResponse } from "next/server";
import { getAllSpots, addSpot, getStats } from "@/lib/store";
import { SurfSpotInput } from "@/types";

// GET /api/spots — list all spots + stats
export async function GET() {
  const spots = await getAllSpots();
  const stats = await getStats();
  return NextResponse.json({ spots, stats });
}

// POST /api/spots — create a new spot
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, location, waveHeight, crowdLevel, vibe, rating, notes } = body;

    if (!name || !location || waveHeight == null || !crowdLevel || !vibe || rating == null) {
      return NextResponse.json(
        { error: "Missing required fields. Need: name, location, waveHeight, crowdLevel, vibe, rating" },
        { status: 400 }
      );
    }

    const input: SurfSpotInput = {
      name: String(name),
      location: String(location),
      waveHeight: Number(waveHeight),
      crowdLevel,
      vibe,
      rating: Math.max(1, Math.min(5, Number(rating))),
      notes: notes ? String(notes) : "",
    };

    const spot = await addSpot(input);
    return NextResponse.json(spot, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}
