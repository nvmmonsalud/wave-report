import { NextRequest, NextResponse } from "next/server";

// Spot name → coordinates (for Storm Glass API)
const COORDS: Record<string, { lat: number; lng: number }> = {
  "Pipeline": { lat: 21.6622, lng: -158.0529 },
  "Malibu Surfrider": { lat: 34.0345, lng: -118.6787 },
  "Uluwatu": { lat: -8.8291, lng: 115.0883 },
  "Mundaka": { lat: 43.4069, lng: -2.7036 },
  "Jefferies Bay": { lat: -34.0513, lng: 24.9284 },
  "Cowells Beach": { lat: 36.9674, lng: -122.0245 },
};

// Fallback mock conditions when no API key
function mockConditions(spotName: string) {
  const coords = COORDS[spotName];
  const seed = spotName.length;
  return {
    spotName,
    waveHeight: (seed % 5 + 2).toFixed(1),
    waterTemp: (seed % 8 + 16).toFixed(0),
    windSpeed: (seed % 15 + 5).toFixed(0),
    windDirection: ["N", "NW", "W", "SW", "S"][seed % 5],
    swellDirection: ["NW", "W", "SW", "S", "SE"][seed % 5],
    swellPeriod: (seed % 6 + 8).toFixed(0),
    timestamp: new Date().toISOString(),
    live: false,
    coords,
  };
}

// GET /api/conditions?name=Pipeline
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json(
      { error: "Missing 'name' query parameter" },
      { status: 400 }
    );
  }

  const coords = COORDS[name];

  if (!coords) {
    // Unknown spot — return generic mock
    return NextResponse.json(mockConditions(name));
  }

  const apiKey = process.env.STORMGLASS_API_KEY;

  // No API key → mock data
  if (!apiKey) {
    return NextResponse.json(mockConditions(name));
  }

  try {
    const url = `https://api.stormglass.io/v2/weather/point?lat=${coords.lat}&lng=${coords.lng}&params=waveHeight,waterTemperature,windSpeed,windDirection,swellDirection,swellPeriod`;
    const res = await fetch(url, {
      headers: { Authorization: apiKey },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(mockConditions(name));
    }

    const data = await res.json();
    const hour = data.hours[0];

    return NextResponse.json({
      spotName: name,
      waveHeight: hour.waveHeight?.sg ?? "N/A",
      waterTemp: hour.waterTemperature?.sg ?? "N/A",
      windSpeed: hour.windSpeed?.sg ?? "N/A",
      windDirection: hour.windDirection?.sg ? `${Math.round(hour.windDirection.sg)}°` : "N/A",
      swellDirection: hour.swellDirection?.sg ? `${Math.round(hour.swellDirection.sg)}°` : "N/A",
      swellPeriod: hour.swellPeriod?.sg ?? "N/A",
      timestamp: data.hours[0].time,
      live: true,
      coords,
    });
  } catch {
    return NextResponse.json(mockConditions(name));
  }
}
