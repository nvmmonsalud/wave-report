"use client";

import { useState, useEffect, useCallback } from "react";
import { SurfSpot, SurfSpotInput, Stats, CrowdLevel, Vibe } from "@/types";
import StatsGrid from "@/components/StatsGrid";
import FilterBar, { Filters } from "@/components/FilterBar";
import SpotCard from "@/components/SpotCard";
import AddSpotForm from "@/components/AddSpotForm";
import ToastContainer, { showToast } from "@/components/Toast";

export default function Home() {
  const [spots, setSpots] = useState<SurfSpot[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    vibe: "all",
    crowdLevel: "all",
    sortBy: "rating",
    search: "",
  });

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/spots");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setSpots(data.spots);
      setStats(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = async (input: SurfSpotInput): Promise<boolean> => {
    try {
      const res = await fetch("/api/spots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to add spot");
      await fetchData();
      showToast(`Added ${input.name} 🏄`, "success");
      return true;
    } catch {
      showToast("Failed to add spot", "error");
      return false;
    }
  };

  const handleDelete = async (id: string) => {
    const spot = spots.find((s) => s.id === id);
    const prev = spots;
    setSpots((s) => s.filter((spot) => spot.id !== id));
    try {
      const res = await fetch(`/api/spots/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      await fetchData();
      showToast(`Removed ${spot?.name ?? "spot"} 🗑️`, "info");
    } catch {
      setSpots(prev);
      showToast("Failed to delete", "error");
    }
  };

  const handleRate = async (id: string, rating: number) => {
    const spot = spots.find((s) => s.id === id);
    setSpots((s) => s.map((spot) => (spot.id === id ? { ...spot, rating } : spot)));
    try {
      const res = await fetch(`/api/spots/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      });
      if (!res.ok) throw new Error("Failed");
      await fetchData();
      showToast(`Rated ${spot?.name ?? "spot"} ${rating}★`, "success");
    } catch {
      await fetchData();
      showToast("Failed to update rating", "error");
    }
  };

  // Apply filters + search + sorting
  const filteredSpots = spots
    .filter((s) => filters.vibe === "all" || s.vibe === filters.vibe)
    .filter((s) => filters.crowdLevel === "all" || s.crowdLevel === filters.crowdLevel)
    .filter((s) => {
      if (!filters.search.trim()) return true;
      const q = filters.search.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q) ||
        s.notes.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (filters.sortBy === "rating") return b.rating - a.rating;
      if (filters.sortBy === "waveHeight") return b.waveHeight - a.waveHeight;
      return a.name.localeCompare(b.name);
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🏄</div>
          <p className="text-cyan-200/60">Paddling out...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🌊</div>
          <p className="text-red-400">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-cyan-400 text-slate-900 rounded-lg font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero header */}
      <header className="text-center pt-16 pb-8 px-4">
        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-teal-300 mb-3">
          🌊 Wave Report
        </h1>
        <p className="text-cyan-200/60 text-lg">
          Rate the breaks. Track the vibes. Find your next wave. 🏄
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-20">
        {/* Stats */}
        <StatsGrid stats={stats} />

        {/* Add spot */}
        <AddSpotForm onAdd={handleAdd} />

        {/* Filters + Search */}
        <FilterBar
          filters={filters}
          onChange={setFilters}
          resultCount={filteredSpots.length}
        />

        {/* Spot grid */}
        {filteredSpots.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏝️</div>
            <p className="text-cyan-200/50 text-lg">
              {filters.search
                ? `No spots match "${filters.search}", bro. Try another search!`
                : "No spots match your filters, bro. Try widening the search!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSpots.map((spot) => (
              <SpotCard
                key={spot.id}
                spot={spot}
                onDelete={handleDelete}
                onRate={handleRate}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-cyan-200/30 text-sm">
        Built with Next.js + GLM 5.2 🤙 · Deploy to Vercel ready
      </footer>

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
}
