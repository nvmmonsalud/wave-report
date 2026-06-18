"use client";

import { SurfSpot, CrowdLevel, Vibe } from "@/types";

const crowdColors: Record<CrowdLevel, string> = {
  empty: "bg-emerald-400/20 text-emerald-300 border-emerald-400/30",
  light: "bg-teal-400/20 text-teal-300 border-teal-400/30",
  moderate: "bg-yellow-400/20 text-yellow-300 border-yellow-400/30",
  crowded: "bg-orange-400/20 text-orange-300 border-orange-400/30",
  packed: "bg-red-400/20 text-red-300 border-red-400/30",
};

const vibeColors: Record<Vibe, string> = {
  chill: "from-teal-500/30 to-cyan-600/30 border-teal-400/30",
  fun: "from-sky-500/30 to-blue-600/30 border-sky-400/30",
  pumping: "from-orange-500/30 to-amber-600/30 border-orange-400/30",
  gnarly: "from-red-500/30 to-rose-600/30 border-red-400/30",
  epic: "from-purple-500/30 to-indigo-600/30 border-purple-400/30",
};

const vibeEmoji: Record<Vibe, string> = {
  chill: "😌",
  fun: "😎",
  pumping: "🔥",
  gnarly: "💀",
  epic: "🏆",
};

export default function SpotCard({
  spot,
  onDelete,
  onRate,
}: {
  spot: SurfSpot;
  onDelete: (id: string) => void;
  onRate: (id: string, rating: number) => void;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${vibeColors[spot.vibe]} backdrop-blur-md p-5 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/10 group`}
    >
      {/* Wave height badge */}
      <div className="absolute top-4 right-4 flex items-center gap-1 bg-slate-900/60 rounded-full px-3 py-1">
        <span className="text-cyan-400 text-lg font-bold">{spot.waveHeight}</span>
        <span className="text-cyan-200/50 text-xs">ft</span>
      </div>

      {/* Name + location */}
      <h3 className="text-xl font-bold text-white mb-1 pr-16">{spot.name}</h3>
      <p className="text-sm text-cyan-100/60 mb-3">📍 {spot.location}</p>

      {/* Vibe + crowd badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/80 border border-white/10">
          {vibeEmoji[spot.vibe]} {spot.vibe}
        </span>
        <span
          className={`text-xs px-2 py-1 rounded-full border ${crowdColors[spot.crowdLevel]}`}
        >
          👥 {spot.crowdLevel}
        </span>
      </div>

      {/* Notes */}
      {spot.notes && (
        <p className="text-sm text-white/50 mb-4 line-clamp-2 italic">&ldquo;{spot.notes}&rdquo;</p>
      )}

      {/* Rating stars */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRate(spot.id, star)}
            className={`text-lg transition-all hover:scale-125 ${
              star <= spot.rating ? "text-amber-400" : "text-white/20"
            }`}
          >
            ★
          </button>
        ))}
        <span className="text-xs text-white/40 ml-2">{spot.rating}/5</span>
      </div>

      {/* Delete button */}
      <button
        onClick={() => onDelete(spot.id)}
        className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-red-400/70 hover:text-red-400 text-sm"
        title="Delete spot"
      >
        🗑️
      </button>
    </div>
  );
}
