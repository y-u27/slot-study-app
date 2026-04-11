'use client'

import { useCallback, useEffect, useState } from 'react'
import { fetchLogs, updateLogStatus } from '@/lib/supabaseStore'
import type { StudyLogRow } from '@/lib/types'
import { StatsSection }    from '@/components/dashboard/StatsSection'
import { ChartSection }    from '@/components/dashboard/ChartSection'
import { LogsSection }     from '@/components/dashboard/LogsSection'
import { SettingsSection } from '@/components/dashboard/SettingsSection'

export default function DashboardPage() {
  const [logs, setLogs] = useState<StudyLogRow[]>([])

  const refreshLogs = useCallback(async () => {
    const data = await fetchLogs()
    setLogs(data)
  }, [])

  useEffect(() => {
    refreshLogs()
  }, [refreshLogs])

  const achievementRate =
    logs.length === 0
      ? 0
      : Math.round((logs.filter((l) => l.status).length / logs.length) * 100)

  const toggleStatus = async (id: string, current: boolean) => {
    const next = !current
    await updateLogStatus(id, next)
    setLogs((prev) => prev.map((l) => (l.id === id ? { ...l, status: next } : l)))
  }

  return (
    <div className="flex flex-col gap-5 py-6 px-4 pb-8">
      <h1 className="text-lg font-bold text-gray-800">ダッシュボード</h1>

      {/* ① ステータス */}
      <StatsSection logs={logs} achievementRate={achievementRate} />

      {/* ② グラフ */}
      <ChartSection logs={logs} />

      {/* ③ ログ一覧 */}
      <LogsSection logs={logs} onToggleStatus={toggleStatus} />

      {/* ④ 設定 */}
      <SettingsSection />
    </div>
  )
}
