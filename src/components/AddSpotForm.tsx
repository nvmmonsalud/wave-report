"use client";

import { useState } from "react";
import { CrowdLevel, Vibe, SurfSpotInput } from "@/types";

const crowdLevels: CrowdLevel[] = ["empty", "light", "moderate", "crowded", "packed"];
const vibes: Vibe[] = ["chill", "fun", "pumping", "gnarly", "epic"];

export default function AddSpotForm({ onAdd }: { onAdd: (spot: SurfSpotInput) => Promise<boolean> }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [waveHeight, setWaveHeight] = useState("4");
  const [crowdLevel, setCrowdLevel] = useState<CrowdLevel>("light");
  const [vibe, setVibe] = useState<Vibe>("fun");
  const [rating, setRating] = useState(3);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setName("");
    setLocation("");
    setWaveHeight("4");
    setCrowdLevel("light");
    setVibe("fun");
    setRating(3);
    setNotes("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !location.trim()) return;
    setSubmitting(true);
    const ok = await onAdd({
      name: name.trim(),
      location: location.trim(),
      waveHeight: Number(waveHeight),
      crowdLevel,
      vibe,
      rating,
      notes: notes.trim(),
    });
    setSubmitting(false);
    if (ok) {
      reset();
      setOpen(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full mb-6 rounded-2xl border-2 border-dashed border-cyan-400/20 bg-cyan-400/5 text-cyan-300/70 py-4 text-lg font-medium hover:border-cyan-400/40 hover:bg-cyan-400/10 transition-all"
      >
        + Add Surf Spot 🏄
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-2xl border border-cyan-400/20 bg-slate-900/60 backdrop-blur-md p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">New Surf Spot 🌊</h2>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-white/40 hover:text-white/80 text-xl"
        >
          ✕
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-cyan-200/60 uppercase tracking-wide mb-1">
            Spot Name *
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Trestles"
            className="w-full bg-slate-800/80 text-white rounded-lg px-3 py-2 border border-white/10 focus:border-cyan-400 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-xs text-cyan-200/60 uppercase tracking-wide mb-1">
            Location *
          </label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. San Clemente, CA"
            className="w-full bg-slate-800/80 text-white rounded-lg px-3 py-2 border border-white/10 focus:border-cyan-400 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-xs text-cyan-200/60 uppercase tracking-wide mb-1">
            Wave Height (ft)
          </label>
          <input
            type="number"
            min="0"
            max="50"
            value={waveHeight}
            onChange={(e) => setWaveHeight(e.target.value)}
            className="w-full bg-slate-800/80 text-white rounded-lg px-3 py-2 border border-white/10 focus:border-cyan-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-cyan-200/60 uppercase tracking-wide mb-1">
            Rating
          </label>
          <div className="flex gap-1 items-center h-[42px]">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                className={`text-2xl transition-all hover:scale-125 ${
                  s <= rating ? "text-amber-400" : "text-white/20"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs text-cyan-200/60 uppercase tracking-wide mb-1">
            Crowd Level
          </label>
          <select
            value={crowdLevel}
            onChange={(e) => setCrowdLevel(e.target.value as CrowdLevel)}
            className="w-full bg-slate-800/80 text-white rounded-lg px-3 py-2 border border-white/10 focus:border-cyan-400 focus:outline-none cursor-pointer"
          >
            {crowdLevels.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-cyan-200/60 uppercase tracking-wide mb-1">
            Vibe
          </label>
          <select
            value={vibe}
            onChange={(e) => setVibe(e.target.value as Vibe)}
            className="w-full bg-slate-800/80 text-white rounded-lg px-3 py-2 border border-white/10 focus:border-cyan-400 focus:outline-none cursor-pointer"
          >
            {vibes.map((v) => (
              <option key={v} value={v}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-xs text-cyan-200/60 uppercase tracking-wide mb-1">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Best tide, hazards, pro tips..."
          rows={2}
          className="w-full bg-slate-800/80 text-white rounded-lg px-3 py-2 border border-white/10 focus:border-cyan-400 focus:outline-none resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={submitting || !name.trim() || !location.trim()}
        className="mt-4 w-full bg-cyan-400 text-slate-900 font-bold rounded-lg py-3 hover:bg-cyan-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {submitting ? "Adding..." : "Drop in! 🏄"}
      </button>
    </form>
  );
}
