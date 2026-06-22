import { NextRequest, NextResponse } from "next/server";
import { getAllSpots } from "@/lib/store";
import { SurfSpot } from "@/types";

interface CoachPreferences {
  skillLevel: "beginner" | "intermediate" | "advanced" | "pro";
  preferredWaveSize: "small" | "medium" | "big" | "any";
  preferredVibe: "chill" | "fun" | "pumping" | "gnarly" | "epic" | "any";
  crowdTolerance: "empty" | "light" | "moderate" | "crowded" | "packed" | "any";
}

interface CoachRecommendation {
  spotId: string;
  spotName: string;
  score: number;
  headline: string;
  reasons: string[];
  warnings: string[];
}

interface CoachResponse {
  preferences: CoachPreferences;
  topPicks: CoachRecommendation[];
  summary: string;
  liveData: boolean;
  generatedAt: string;
}

// Heuristic fallback when no ANTHROPIC_API_KEY is set (or model call fails)
function heuristicCoach(
  spots: SurfSpot[],
  prefs: CoachPreferences,
  conditionsByName: Record<string, any>,
  anyLiveData: boolean
): CoachResponse {
  const maxWaveForSkill: Record<CoachPreferences["skillLevel"], number> = {
    beginner: 3,
    intermediate: 6,
    advanced: 10,
    pro: 30,
  };

  const waveSizeRanges: Record<
    CoachPreferences["preferredWaveSize"],
    { min: number; max: number }
  > = {
    small: { min: 0, max: 3 },
    medium: { min: 3, max: 7 },
    big: { min: 7, max: 30 },
    any: { min: 0, max: 30 },
  };

  const crowdRank: Record<CoachPreferences["crowdTolerance"], number> = {
    empty: 0,
    light: 1,
    moderate: 2,
    crowded: 3,
    packed: 4,
    any: 4,
  };

  const crowdLevels: Record<string, number> = {
    empty: 0,
    light: 1,
    moderate: 2,
    crowded: 3,
    packed: 4,
  };

  const range = waveSizeRanges[prefs.preferredWaveSize];
  const maxSkill = maxWaveForSkill[prefs.skillLevel];
  const maxCrowd = crowdRank[prefs.crowdTolerance];

  const scored = spots.map((spot) => {
    let score = 50;
    const reasons: string[] = [];
    const warnings: string[] = [];

    // Use live wave height if available, otherwise static
    const liveWh = conditionsByName[spot.name]?.waveHeight;
    const liveWhNum =
      typeof liveWh === "number" ? liveWh : parseFloat(liveWh);
    const effectiveWaveHeight =
      !isNaN(liveWhNum) && liveWhNum > 0 ? liveWhNum : spot.waveHeight;
    const usingLive =
      !isNaN(liveWhNum) && liveWhNum > 0 && conditionsByName[spot.name]?.live;

    if (usingLive) {
      reasons.push(`Live data: ${effectiveWaveHeight}m waves right now`);
    }

    if (effectiveWaveHeight >= range.min && effectiveWaveHeight <= range.max) {
      score += 20;
      reasons.push(`${effectiveWaveHeight}ft is in your preferred range`);
    } else if (effectiveWaveHeight < range.min) {
      score -= 10;
      warnings.push(`Waves are smaller (${effectiveWaveHeight}ft) than you wanted`);
    } else {
      score -= 25;
      warnings.push(`Waves are bigger (${effectiveWaveHeight}ft) than you wanted`);
    }

    if (effectiveWaveHeight > maxSkill) {
      score -= 30;
      warnings.push(
        `Over your skill ceiling (${maxSkill}ft for ${prefs.skillLevel})`
      );
    } else {
      score += 10;
      reasons.push(`Safe for ${prefs.skillLevel} surfers`);
    }

    if (prefs.preferredVibe !== "any" && spot.vibe === prefs.preferredVibe) {
      score += 15;
      reasons.push(`Matches your ${prefs.preferredVibe} vibe preference`);
    }

    if (crowdLevels[spot.crowdLevel] <= maxCrowd) {
      score += 10;
      if (spot.crowdLevel === "light" || spot.crowdLevel === "empty") {
        reasons.push(`Currently ${spot.crowdLevel} — uncrowded lineups`);
      }
    } else {
      score -= 15;
      warnings.push(
        `Will be ${spot.crowdLevel} (you wanted ${prefs.crowdTolerance})`
      );
    }

    if (spot.rating >= 4) {
      score += 5;
      reasons.push(`${spot.rating}★ community rating`);
    }

    score = Math.max(0, Math.min(100, score));

    return {
      spotId: spot.id,
      spotName: spot.name,
      score,
      headline: reasons[0] || `${spot.name} — ${spot.location}`,
      reasons: reasons.slice(0, 3),
      warnings,
    };
  });

  const topPicks = scored.sort((a, b) => b.score - a.score).slice(0, 3);

  const summary =
    topPicks[0]?.score >= 70
      ? `Solid match found: ${topPicks[0].spotName} is your best bet today.${
          anyLiveData ? " Recommendations reflect live conditions." : ""
        }`
      : topPicks[0]?.score >= 50
      ? `Decent options. ${topPicks[0].spotName} leads the pack.${
          anyLiveData ? " Live conditions factored in." : ""
        }`
      : `Tough day for your preferences. ${
          topPicks[0]?.spotName ?? "any spot"
        } is the least-bad option.`;

  return {
    preferences: prefs,
    topPicks,
    summary,
    liveData: anyLiveData,
    generatedAt: new Date().toISOString(),
  };
}

export async function POST(request: NextRequest) {
  let prefs: CoachPreferences;
  try {
    const body = await request.json();
    prefs = body.preferences;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  if (!prefs || !prefs.skillLevel || !prefs.preferredWaveSize) {
    return NextResponse.json(
      {
        error:
          "Missing preferences. Need: skillLevel, preferredWaveSize, preferredVibe, crowdTolerance",
      },
      { status: 400 }
    );
  }

  const spots = await getAllSpots();

  // Fetch live conditions for all spots in parallel with a 5s timeout each
  const liveResults = await Promise.all(
    spots.map(async (spot) => {
      const url = new URL("/api/conditions", request.url);
      url.searchParams.append("name", spot.name);
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(url.toString(), {
          signal: controller.signal,
          cache: "no-store",
        });
        clearTimeout(timer);
        if (!res.ok) return { name: spot.name, conditions: null, live: false };
        const conditions = await res.json();
        return { name: spot.name, conditions, live: !!conditions?.live };
      } catch {
        return { name: spot.name, conditions: null, live: false };
      }
    })
  );

  const conditionsByName: Record<string, any> = {};
  let anyLiveData = false;
  for (const r of liveResults) {
    if (r.conditions) conditionsByName[r.name] = r.conditions;
    if (r.live) anyLiveData = true;
  }

  // Enrich the spots data with live conditions
  const enrichedSpots = spots.map((s) => ({
    ...s,
    liveConditions: conditionsByName[s.name] || null,
  }));

  // If ANTHROPIC_API_KEY is set, use the model. Otherwise fall back to heuristic.
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      heuristicCoach(spots, prefs, conditionsByName, anyLiveData)
    );
  }

  // Model call (graceful degradation if it fails → heuristic)
  try {
    const prompt = `You are an expert surf coach. A surfer has these preferences:
- Skill level: ${prefs.skillLevel}
- Preferred wave size: ${prefs.preferredWaveSize}
- Preferred vibe: ${prefs.preferredVibe}
- Crowd tolerance: ${prefs.crowdTolerance}

Here are the available surf spots with their current conditions (when available):
${JSON.stringify(enrichedSpots, null, 2)}

CRITICAL: For each spot, if \`liveConditions\` is present and \`live: true\`, USE THE LIVE \`waveHeight\` (in meters) for scoring — the static \`waveHeight\` field is in feet and is only a baseline. Convert meters → feet roughly: 1m ≈ 3.28ft. Flag any spot where current conditions are dangerous for the surfer's level (e.g. live wave height > skill ceiling, onshore wind > 15kt, dangerously cold water temp). If \`liveConditions\` is null or \`live: false\`, fall back to the static \`waveHeight\` field.

Rank the top 3 spots for this surfer. For each, return:
- spotId (string)
- spotName (string)
- score (0-100, higher = better match)
- headline (one punchy sentence, max 12 words, why this spot matches)
- reasons (array of 2-3 short reasons; cite live conditions when relevant)
- warnings (array of 0-2 short concerns; flag any condition-based safety issues)

Then add a "summary" field with 1-2 sentences overall. If you used live data, mention that the recommendations reflect current conditions.

Also include "preferences" (echo back the input) and "generatedAt" (ISO timestamp).

Respond ONLY with valid JSON matching this exact shape:
{
  "preferences": { ...echo input... },
  "topPicks": [ {spotId, spotName, score, headline, reasons, warnings}, ...3 items ],
  "summary": "...",
  "generatedAt": "..."
}`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 1800,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        heuristicCoach(spots, prefs, conditionsByName, anyLiveData)
      );
    }

    const data = await res.json();
    const text = data.content?.[0]?.text;
    if (!text) {
      return NextResponse.json(
        heuristicCoach(spots, prefs, conditionsByName, anyLiveData)
      );
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        heuristicCoach(spots, prefs, conditionsByName, anyLiveData)
      );
    }

    const parsed: CoachResponse = JSON.parse(jsonMatch[0]);
    parsed.preferences = prefs;
    parsed.liveData = anyLiveData;
    parsed.generatedAt = parsed.generatedAt || new Date().toISOString();
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(
      heuristicCoach(spots, prefs, conditionsByName, anyLiveData)
    );
  }
}
