"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchLogs } from "@/lib/supabaseStore";
import type { StudyLogRow } from "@/lib/types";
import { StatsSection } from "@/components/dashboard/StatsSection";
import { ChartSection } from "@/components/dashboard/ChartSection";
import { SettingsSection } from "@/components/dashboard/SettingsSection";

export default function DashboardPage() {
  const [logs, setLogs] = useState<StudyLogRow[]>([]);

  const refreshLogs = useCallback(async () => {
    const data = await fetchLogs();
    setLogs(data);
  }, []);

  useEffect(() => {
    refreshLogs();
  }, [refreshLogs]);

  const achievementRate =
    logs.length === 0
      ? 0
      : Math.round((logs.filter((l) => l.status).length / logs.length) * 100);

  return (
    <div className="flex flex-col gap-5 py-6 px-4 pb-8">
      <h1 className="text-lg font-bold text-gray-800">ダッシュボード</h1>

      {/* ① ステータス */}
      <StatsSection logs={logs} achievementRate={achievementRate} />

      {/* ② グラフ */}
      <ChartSection logs={logs} />

      {/* ③ 設定 */}
      <SettingsSection />
    </div>
  );
}
