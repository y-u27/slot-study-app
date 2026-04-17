"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchLogs } from "@/lib/supabaseStore";
import type { StudyLogRow } from "@/lib/types";
import { StatsSection } from "@/components/dashboard/StatsSection";
import { ChartSection } from "@/components/dashboard/ChartSection";
import { SettingsSection } from "@/components/dashboard/SettingsSection";
import { useAuth } from "@/lib/auth";
import { LoginModal } from "@/components/LoginModal";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
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

  if (!loading && !user) {
    return (
      <>
        <div className="px-4 py-6 flex flex-col items-center gap-6 pt-20">
          <p className="text-4xl">📊</p>
          <div className="text-center">
            <p className="font-bold text-gray-800 mb-1">ダッシュボードを使うにはログインが必要です</p>
            <p className="text-sm text-gray-400">達成率・グラフ・設定を確認できます</p>
          </div>
          <button
            onClick={() => setShowLogin(true)}
            className="px-8 py-3 rounded-xl font-bold text-sm text-white"
            style={{
              background: "linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)",
              boxShadow: "0 3px 0 #1d4ed8",
            }}
          >
            ログイン
          </button>
        </div>
        {showLogin && (
          <LoginModal onClose={() => setShowLogin(false)} onSuccess={() => setShowLogin(false)} />
        )}
      </>
    );
  }

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
