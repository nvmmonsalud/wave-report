"use client";

import { Stats, Vibe } from "@/types";

const vibeColors: Record<Vibe, string> = {
  chill: "from-teal-400 to-cyan-500",
  fun: "from-sky-400 to-blue-500",
  pumping: "from-orange-400 to-amber-500",
  gnarly: "from-red-400 to-rose-500",
  epic: "from-purple-400 to-indigo-500",
};

const vibeEmoji: Record<Vibe, string> = {
  chill: "😌",
  fun: "😎",
  pumping: "🔥",
  gnarly: "💀",
  epic: "🏆",
};

export default function StatsGrid({ stats }: { stats: Stats | null }) {
  if (!stats) return null;

  const cards = [
    {
      label: "Total Spots",
      value: stats.totalSpots,
      icon: "🏖️",
      gradient: "from-cyan-500/20 to-blue-500/20",
    },
    {
      label: "Avg Rating",
      value: `${stats.averageRating}★`,
      icon: "⭐",
      gradient: "from-amber-500/20 to-yellow-500/20",
    },
    {
      label: "Biggest Wave",
      value: stats.bestWave ? `${stats.bestWave.height}ft` : "—",
      sub: stats.bestWave?.name,
      icon: "🌊",
      gradient: "from-teal-500/20 to-emerald-500/20",
    },
    {
      label: "Avg Wave Height",
      value: `${stats.averageWaveHeight}ft`,
      icon: "📏",
      gradient: "from-indigo-500/20 to-purple-500/20",
    },
    {
      label: "Dominant Vibe",
      value: stats.mostCommonVibe
        ? `${vibeEmoji[stats.mostCommonVibe]} ${stats.mostCommonVibe}`
        : "—",
      icon: "🎭",
      gradient: stats.mostCommonVibe
        ? vibeColors[stats.mostCommonVibe]
        : "from-gray-500/20 to-gray-600/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${card.gradient} p-4 backdrop-blur-md transition-transform hover:scale-105 hover:border-white/20`}
        >
          <div className="text-2xl mb-1">{card.icon}</div>
          <div className="text-2xl font-bold text-white">{card.value}</div>
          <div className="text-xs text-cyan-100/70 uppercase tracking-wide mt-1">
            {card.label}
          </div>
          {card.sub && (
            <div className="text-xs text-white/50 mt-1 truncate">{card.sub}</div>
          )}
        </div>
      ))}
    </div>
  );
}
