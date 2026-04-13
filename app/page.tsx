"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchAchievementRate } from "@/lib/supabaseStore";
import SlotMachine from "@/components/SlotMachine";
import { getEvo } from "@/hooks/useSlotMachine";

export default function PlayPage() {
  const [achievementRate, setAchievementRate] = useState(0);

  const refreshRate = useCallback(async () => {
    const rate = await fetchAchievementRate();
    setAchievementRate(rate);
  }, []);

  useEffect(() => {
    refreshRate();
  }, [refreshRate]);

  const evo = getEvo(achievementRate);

  const barColor =
    achievementRate >= 80
      ? "linear-gradient(90deg, #fbbf24, #f59e0b)"
      : achievementRate >= 60
        ? "linear-gradient(90deg, #60a5fa, #3b82f6)"
        : achievementRate >= 30
          ? "linear-gradient(90deg, #86efac, #22c55e)"
          : "linear-gradient(90deg, #d1d5db, #9ca3af)";

  return (
    <div className="flex flex-col items-center gap-5 py-6 px-4">
      <SlotMachine achievementRate={achievementRate} onRecorded={refreshRate} />

      {/* 簡易ステータス */}
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-3 flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-500">達成率</span>
            <span className="text-xs font-bold" style={{ color: evo.accent }}>
              {evo.label} · {achievementRate}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 rounded-full transition-all duration-700"
              style={{ width: `${achievementRate}%`, background: barColor }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
