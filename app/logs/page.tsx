"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchLogs, updateLogStatus } from "@/lib/supabaseStore";
import type { StudyLogRow } from "@/lib/types";
import { LogCalendar } from "@/components/logs/LogCalendar";
import { DayLogList } from "@/components/logs/DayLogList";
import { useAuth } from "@/lib/auth";
import { LoginModal } from "@/components/LoginModal";

// StatsSection(204px) + gap-5(20px) + ChartSection(214px) = 438px
const CARD_H = 438;

function isEditable(createdAt: string | null): boolean {
  if (!createdAt) return false;
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return createdAt.split("T")[0] === todayStr;
}

export default function LogsPage() {
  const { user, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [logs, setLogs] = useState<StudyLogRow[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const refreshLogs = useCallback(async () => {
    const data = await fetchLogs();
    setLogs(data);
  }, []);

  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    setSelected(`${yyyy}-${mm}-${dd}`);
    refreshLogs();
  }, [refreshLogs]);

  const toggleStatus = async (id: string, current: boolean) => {
    const log = logs.find((l) => l.id === id);
    if (!log || !isEditable(log.created_at)) return;
    await updateLogStatus(id, !current);
    await refreshLogs();
  };

  const handleSelect = (date: string) => {
    setSelected(date || null);
  };

  if (!loading && !user) {
    return (
      <>
        <div className="px-4 py-6 flex flex-col items-center gap-6 pt-20">
          <p className="text-4xl">📋</p>
          <div className="text-center">
            <p className="font-bold text-gray-800 mb-1">ログを確認するにはログインが必要です</p>
            <p className="text-sm text-gray-400">学習記録を保存・振り返りできます</p>
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
    <div className="px-4 py-6 flex flex-col gap-3">
      <h1 className="text-lg font-bold text-gray-800">ログ</h1>

      <div className="flex gap-3" style={{ height: CARD_H }}>
        {/* ── 左：カレンダーカード（38%） ── */}
        <div className="w-[60%] bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <LogCalendar
            logs={logs}
            selected={selected}
            onSelect={handleSelect}
          />
        </div>

        {/* ── 右：ログ一覧カード（62%） ── */}
        <div className="w-[60%] bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <DayLogList
            logs={logs}
            selected={selected}
            onToggleStatus={toggleStatus}
          />
        </div>
      </div>
    </div>
  );
}
