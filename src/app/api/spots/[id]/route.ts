import { NextRequest, NextResponse } from "next/server";
import { getSpotById, updateSpot, deleteSpot } from "@/lib/store";
import { SurfSpotInput } from "@/types";

// GET /api/spots/[id] — get a single spot
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const spot = getSpotById(id);
  if (!spot) {
    return NextResponse.json({ error: "Spot not found" }, { status: 404 });
  }
  return NextResponse.json(spot);
}

// PATCH /api/spots/[id] — update a spot
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const input: Partial<SurfSpotInput> = {};
    if (body.name) input.name = String(body.name);
    if (body.location) input.location = String(body.location);
    if (body.waveHeight != null) input.waveHeight = Number(body.waveHeight);
    if (body.crowdLevel) input.crowdLevel = body.crowdLevel;
    if (body.vibe) input.vibe = body.vibe;
    if (body.rating != null) input.rating = Math.max(1, Math.min(5, Number(body.rating)));
    if (body.notes !== undefined) input.notes = String(body.notes);

    const spot = updateSpot(id, input);
    if (!spot) {
      return NextResponse.json({ error: "Spot not found" }, { status: 404 });
    }
    return NextResponse.json(spot);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}

// DELETE /api/spots/[id] — delete a spot
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = deleteSpot(id);
  if (!deleted) {
    return NextResponse.json({ error: "Spot not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
