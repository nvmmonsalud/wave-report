"use client";

import { useState } from "react";
import { showToast } from "./Toast";

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

const DEFAULT_PREFS: CoachPreferences = {
  skillLevel: "intermediate",
  preferredWaveSize: "any",
  preferredVibe: "any",
  crowdTolerance: "any",
};

export default function SurfCoach() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<CoachPreferences>(DEFAULT_PREFS);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CoachResponse | null>(null);

  const handleCoach = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences: prefs }),
      });
      if (!res.ok) throw new Error("Coach request failed");
      const data: CoachResponse = await res.json();
      setResult(data);
      showToast(
        data.liveData
          ? "AI Coach found live picks 🏄"
          : "Coach found your top 3 picks 🏄",
        "success"
      );
    } catch {
      showToast("Coach request failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-300";
    if (score >= 60) return "text-cyan-300";
    if (score >= 40) return "text-amber-300";
    return "text-rose-300";
  };

  const scoreBg = (score: number) => {
    if (score >= 80) return "from-emerald-500/20 to-cyan-500/20 border-emerald-400/40";
    if (score >= 60) return "from-cyan-500/20 to-sky-500/20 border-cyan-400/40";
    if (score >= 40) return "from-amber-500/20 to-orange-500/20 border-amber-400/40";
    return "from-rose-500/20 to-pink-500/20 border-rose-400/40";
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-sky-500/10 to-teal-500/10 border border-cyan-400/30 hover:border-cyan-400/60 transition-all"
      >
        <div className="flex items-center justify-center gap-3">
          <span className="text-2xl">🏄‍♂️</span>
          <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-teal-300">
            AI Surf Coach
          </span>
          <span className="text-cyan-200/40 text-sm">
            {open ? "▲" : "▼"}
          </span>
        </div>
        <p className="text-cyan-200/50 text-sm mt-1">
          Tell me your level and vibe. I&apos;ll rank the top 3 spots for you.
        </p>
      </button>

      {open && (
        <div className="mt-4 p-6 rounded-2xl bg-slate-900/60 border border-cyan-400/20 backdrop-blur-md">
          {!result ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                {/* Skill Level */}
                <div>
                  <label className="block text-cyan-200/70 text-sm mb-2 font-semibold">
                    Skill level
                  </label>
                  <div className="grid grid-cols-4 gap-1">
                    {(["beginner", "intermediate", "advanced", "pro"] as const).map(
                      (lvl) => (
                        <button
                          key={lvl}
                          onClick={() => setPrefs({ ...prefs, skillLevel: lvl })}
                          className={`px-2 py-2 rounded-lg text-xs font-bold transition-all ${
                            prefs.skillLevel === lvl
                              ? "bg-cyan-400 text-slate-900"
                              : "bg-slate-800/60 text-cyan-200/60 hover:bg-slate-700/60"
                          }`}
                        >
                          {lvl === "intermediate" ? "inter" : lvl}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Wave Size */}
                <div>
                  <label className="block text-cyan-200/70 text-sm mb-2 font-semibold">
                    Wave size
                  </label>
                  <div className="grid grid-cols-4 gap-1">
                    {(["small", "medium", "big", "any"] as const).map(
                      (sz) => (
                        <button
                          key={sz}
                          onClick={() => setPrefs({ ...prefs, preferredWaveSize: sz })}
                          className={`px-2 py-2 rounded-lg text-xs font-bold transition-all ${
                            prefs.preferredWaveSize === sz
                              ? "bg-cyan-400 text-slate-900"
                              : "bg-slate-800/60 text-cyan-200/60 hover:bg-slate-700/60"
                          }`}
                        >
                          {sz === "medium" ? "med" : sz}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Vibe */}
                <div>
                  <label className="block text-cyan-200/70 text-sm mb-2 font-semibold">
                    Vibe
                  </label>
                  <div className="grid grid-cols-6 gap-1">
                    {(["chill", "fun", "pumping", "gnarly", "epic", "any"] as const).map(
                      (vb) => (
                        <button
                          key={vb}
                          onClick={() => setPrefs({ ...prefs, preferredVibe: vb })}
                          className={`px-1 py-2 rounded-lg text-xs font-bold transition-all ${
                            prefs.preferredVibe === vb
                              ? "bg-cyan-400 text-slate-900"
                              : "bg-slate-800/60 text-cyan-200/60 hover:bg-slate-700/60"
                          }`}
                        >
                          {vb === "any" ? "any" : vb.slice(0, 4)}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Crowd */}
                <div>
                  <label className="block text-cyan-200/70 text-sm mb-2 font-semibold">
                    Crowd tolerance
                  </label>
                  <div className="grid grid-cols-6 gap-1">
                    {(
                      ["empty", "light", "moderate", "crowded", "packed", "any"] as const
                    ).map((c) => (
                      <button
                        key={c}
                        onClick={() => setPrefs({ ...prefs, crowdTolerance: c })}
                        className={`px-1 py-2 rounded-lg text-xs font-bold transition-all ${
                          prefs.crowdTolerance === c
                            ? "bg-cyan-400 text-slate-900"
                            : "bg-slate-800/60 text-cyan-200/60 hover:bg-slate-700/60"
                        }`}
                      >
                        {c === "any" ? "any" : c.slice(0, 4)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleCoach}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-900 font-black text-lg hover:from-cyan-300 hover:to-teal-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? "🏄 Reading the swell..." : "🌊 Find My Top 3 Spots"}
              </button>
            </>
          ) : (
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-cyan-200 mb-1">
                    {result.summary}
                  </h3>
                  <p className="text-cyan-200/50 text-xs">
                    {result.liveData ? "🟢 live conditions" : "📊 data-driven"} ·{" "}
                    {new Date(result.generatedAt).toLocaleTimeString()}
                  </p>
                </div>
                <button
                  onClick={() => setResult(null)}
                  className="text-cyan-200/50 hover:text-cyan-200 text-sm px-3 py-1 rounded-lg border border-cyan-400/20 hover:border-cyan-400/40"
                >
                  ↻ Re-pick
                </button>
              </div>

              <div className="space-y-3">
                {result.topPicks.map((pick, idx) => (
                  <div
                    key={pick.spotId}
                    className={`p-4 rounded-xl bg-gradient-to-r ${scoreBg(
                      pick.score
                    )} border`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-black text-cyan-200/40">
                          #{idx + 1}
                        </span>
                        <div>
                          <h4 className="text-lg font-bold text-cyan-100">
                            {pick.spotName}
                          </h4>
                          <p className="text-cyan-200/80 text-sm italic">
                            {pick.headline}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`text-3xl font-black ${scoreColor(pick.score)}`}
                      >
                        {pick.score}
                      </div>
                    </div>

                    {pick.reasons.length > 0 && (
                      <ul className="text-cyan-200/70 text-sm space-y-1 mb-2">
                        {pick.reasons.map((r, i) => (
                          <li key={i}>✓ {r}</li>
                        ))}
                      </ul>
                    )}

                    {pick.warnings.length > 0 && (
                      <ul className="text-amber-300/80 text-xs space-y-1">
                        {pick.warnings.map((w, i) => (
                          <li key={i}>⚠ {w}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
