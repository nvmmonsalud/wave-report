"use client";

import { CrowdLevel, Vibe } from "@/types";

export interface Filters {
  vibe: Vibe | "all";
  crowdLevel: CrowdLevel | "all";
  sortBy: "rating" | "waveHeight" | "name";
}

const vibes: (Vibe | "all")[] = ["all", "chill", "fun", "pumping", "gnarly", "epic"];
const crowds: (CrowdLevel | "all")[] = ["all", "empty", "light", "moderate", "crowded", "packed"];
const sorts = [
  { value: "rating" as const, label: "Top Rated" },
  { value: "waveHeight" as const, label: "Biggest Waves" },
  { value: "name" as const, label: "Name A-Z" },
];

const vibeEmoji: Record<string, string> = {
  all: "🌊",
  chill: "😌",
  fun: "😎",
  pumping: "🔥",
  gnarly: "💀",
  epic: "🏆",
};

export default function FilterBar({
  filters,
  onChange,
  resultCount,
}: {
  filters: Filters;
  onChange: (filters: Filters) => void;
  resultCount: number;
}) {
  return (
    <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Vibe filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-cyan-200/60 uppercase tracking-wide">Vibe</span>
          <div className="flex gap-1">
            {vibes.map((v) => (
              <button
                key={v}
                onClick={() => onChange({ ...filters, vibe: v })}
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  filters.vibe === v
                    ? "bg-cyan-400 text-slate-900 font-semibold"
                    : "bg-white/5 text-cyan-100/70 hover:bg-white/10"
                }`}
              >
                {vibeEmoji[v]} {v}
              </button>
            ))}
          </div>
        </div>

        {/* Crowd filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-cyan-200/60 uppercase tracking-wide">Crowd</span>
          <select
            value={filters.crowdLevel}
            onChange={(e) =>
              onChange({ ...filters, crowdLevel: e.target.value as CrowdLevel | "all" })
            }
            className="bg-slate-800/80 text-cyan-100 text-sm rounded-lg px-3 py-1 border border-white/10 focus:border-cyan-400 focus:outline-none cursor-pointer"
          >
            {crowds.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "All Crowds" : c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-cyan-200/60 uppercase tracking-wide">Sort</span>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onChange({ ...filters, sortBy: e.target.value as Filters["sortBy"] })
            }
            className="bg-slate-800/80 text-cyan-100 text-sm rounded-lg px-3 py-1 border border-white/10 focus:border-cyan-400 focus:outline-none cursor-pointer"
          >
            {sorts.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="ml-auto text-sm text-cyan-200/50">
          {resultCount} {resultCount === 1 ? "spot" : "spots"} 🏄
        </div>
      </div>
    </div>
  );
}
