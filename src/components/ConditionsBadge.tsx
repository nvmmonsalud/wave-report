"use client";

import { useState, useEffect } from "react";

export interface Conditions {
  spotName: string;
  waveHeight: string;
  waterTemp: string;
  windSpeed: string;
  windDirection: string;
  swellDirection: string;
  swellPeriod: string;
  live: boolean;
}

export default function ConditionsBadge({ spotName }: { spotName: string }) {
  const [conditions, setConditions] = useState<Conditions | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/conditions?name=${encodeURIComponent(spotName)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setConditions(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [spotName]);

  if (!conditions) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-white/30 mt-2">
        <span className="animate-pulse">📡</span> Loading conditions...
      </div>
    );
  }

  return (
    <div
      className="mt-3 rounded-lg bg-slate-900/40 border border-white/5 overflow-hidden cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center gap-3 px-3 py-2">
        <div className="flex items-center gap-1">
          <span className="text-cyan-400 font-semibold text-sm">{conditions.waveHeight}</span>
          <span className="text-white/40 text-xs">m wave</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-orange-300 font-semibold text-sm">{conditions.waterTemp}°</span>
          <span className="text-white/40 text-xs">water</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sky-300 font-semibold text-sm">{conditions.windSpeed}</span>
          <span className="text-white/40 text-xs">m/s {conditions.windDirection}</span>
        </div>
        <div className="ml-auto flex items-center gap-1">
          {conditions.live ? (
            <span className="text-emerald-400 text-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE
            </span>
          ) : (
            <span className="text-white/30 text-xs">mock</span>
          )}
          <span className={`text-white/30 text-xs transition-transform ${expanded ? "rotate-180" : ""}`}>
            ▼
          </span>
        </div>
      </div>
      {expanded && (
        <div className="px-3 pb-2 text-xs text-white/50 grid grid-cols-2 gap-1">
          <div>Swell dir: <span className="text-white/70">{conditions.swellDirection}</span></div>
          <div>Swell period: <span className="text-white/70">{conditions.swellPeriod}s</span></div>
        </div>
      )}
    </div>
  );
}
