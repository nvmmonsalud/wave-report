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
  score: number; // 0-100
  headline: string; // one-liner why this spot matches
  reasons: string[]; // 2-3 short reasons
  warnings: string[]; // any concerns (e.g. "waves too big for your level")
}

interface CoachResponse {
  preferences: CoachPreferences;
  topPicks: CoachRecommendation[];
  summary: string; // 1-2 sentence overall summary
  liveData: boolean; // whether we had live conditions for analysis
  generatedAt: string;
}

// Heuristic fallback when no ANTHROPIC_API_KEY is set
function heuristicCoach(
  spots: SurfSpot[],
  prefs: CoachPreferences
): CoachResponse {
  // Skill → max wave height mapping (feet)
  const maxWaveForSkill: Record<CoachPreferences["skillLevel"], number> = {
    beginner: 3,
    intermediate: 6,
    advanced: 10,
    pro: 30,
  };

  // Wave size preference → range
  const waveSizeRanges: Record<
    CoachPreferences["preferredWaveSize"],
    { min: number; max: number }
  > = {
    small: { min: 0, max: 3 },
    medium: { min: 3, max: 7 },
    big: { min: 7, max: 30 },
    any: { min: 0, max: 30 },
  };

  // Crowd tolerance → max acceptable crowd
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
    let score = 50; // base
    const reasons: string[] = [];
    const warnings: string[] = [];

    // Wave size match
    if (spot.waveHeight >= range.min && spot.waveHeight <= range.max) {
      score += 20;
      reasons.push(`${spot.waveHeight}ft is in your preferred range`);
    } else if (spot.waveHeight < range.min) {
      score -= 10;
      warnings.push(`Waves are smaller (${spot.waveHeight}ft) than you wanted`);
    } else {
      score -= 25;
      warnings.push(`Waves are bigger (${spot.waveHeight}ft) than you wanted`);
    }

    // Skill level safety
    if (spot.waveHeight > maxSkill) {
      score -= 30;
      warnings.push(
        `Over your skill ceiling (${maxSkill}ft for ${prefs.skillLevel})`
      );
    } else {
      score += 10;
      reasons.push(`Safe for ${prefs.skillLevel} surfers`);
    }

    // Vibe match
    if (prefs.preferredVibe !== "any" && spot.vibe === prefs.preferredVibe) {
      score += 15;
      reasons.push(`Matches your ${prefs.preferredVibe} vibe preference`);
    }

    // Crowd tolerance
    if (crowdLevels[spot.crowdLevel] <= maxCrowd) {
      score += 10;
      if (spot.crowdLevel === "light" || spot.crowdLevel === "empty") {
        reasons.push(`Currently ${spot.crowdLevel} — uncrowded lineups`);
      }
    } else {
      score -= 15;
      warnings.push(`Will be ${spot.crowdLevel} (you wanted ${prefs.crowdTolerance})`);
    }

    // Rating bonus
    if (spot.rating >= 4) {
      score += 5;
      reasons.push(`${spot.rating}★ community rating`);
    }

    score = Math.max(0, Math.min(100, score));

    const headline = reasons[0] || `${spot.name} — ${spot.location}`;
    return {
      spotId: spot.id,
      spotName: spot.name,
      score,
      headline,
      reasons: reasons.slice(0, 3),
      warnings,
    };
  });

  const topPicks = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const summary =
    topPicks[0]?.score >= 70
      ? `Solid match found: ${topPicks[0].spotName} is your best bet today.`
      : topPicks[0]?.score >= 50
      ? `Decent options. ${topPicks[0].spotName} leads the pack.`
      : `Tough day for your preferences. ${topPicks[0]?.spotName ?? "any spot"} is the least-bad option.`;

  return {
    preferences: prefs,
    topPicks,
    summary,
    liveData: false,
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

  // Validate
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

  // If ANTHROPIC_API_KEY is set, use the model. Otherwise fall back to heuristic.
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(heuristicCoach(spots, prefs));
  }

  // Model call (graceful degradation if it fails → heuristic)
  try {
    const prompt = `You are an expert surf coach. A surfer has these preferences:
- Skill level: ${prefs.skillLevel}
- Preferred wave size: ${prefs.preferredWaveSize}
- Preferred vibe: ${prefs.preferredVibe}
- Crowd tolerance: ${prefs.crowdTolerance}

Here are the available surf spots (JSON):
${JSON.stringify(spots, null, 2)}

Rank the top 3 spots for this surfer. For each, return:
- spotId (string)
- spotName (string)
- score (0-100, higher = better match)
- headline (one punchy sentence, max 12 words, why this spot matches)
- reasons (array of 2-3 short reasons)
- warnings (array of 0-2 short concerns)

Then add a "summary" field with 1-2 sentences overall.

Also include "preferences" (echo back the input) and "liveData" (always false in this case) and "generatedAt" (ISO timestamp).

Respond ONLY with valid JSON matching this exact shape:
{
  "preferences": { ...echo input... },
  "topPicks": [ {spotId, spotName, score, headline, reasons, warnings}, ...3 items ],
  "summary": "...",
  "liveData": false,
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
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      return NextResponse.json(heuristicCoach(spots, prefs));
    }

    const data = await res.json();
    const text = data.content?.[0]?.text;
    if (!text) {
      return NextResponse.json(heuristicCoach(spots, prefs));
    }

    // Parse the JSON from the model's response (handle markdown code fences)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(heuristicCoach(spots, prefs));
    }

    const parsed: CoachResponse = JSON.parse(jsonMatch[0]);
    parsed.liveData = false; // we don't fetch live conditions for the coach yet
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(heuristicCoach(spots, prefs));
  }
}
