'use client'

import { useCallback, useEffect, useState } from 'react'
import { fetchLogs, updateLogStatus } from '@/lib/supabaseStore'
import type { StudyLogRow } from '@/lib/types'
import { LogCalendar } from '@/components/logs/LogCalendar'
import { DayLogList }  from '@/components/logs/DayLogList'

// StatsSection(204px) + gap-5(20px) + ChartSection(214px) = 438px
const CARD_H = 438

export default function LogsPage() {
  const [logs,     setLogs]     = useState<StudyLogRow[]>([])
  const [selected, setSelected] = useState<string | null>(null)

  const refreshLogs = useCallback(async () => {
    const data = await fetchLogs()
    setLogs(data)
  }, [])

  useEffect(() => {
    const today = new Date()
    const yyyy  = today.getFullYear()
    const mm    = String(today.getMonth() + 1).padStart(2, '0')
    const dd    = String(today.getDate()).padStart(2, '0')
    setSelected(`${yyyy}-${mm}-${dd}`)
    refreshLogs()
  }, [refreshLogs])

  const toggleStatus = async (id: string, current: boolean) => {
    await updateLogStatus(id, !current)
    await refreshLogs()
  }

  const handleSelect = (date: string) => {
    setSelected(date || null)
  }

  return (
    // ダッシュボードと同じ余白・同じ幅コンテナ
    <div className="px-4 py-6">
      <h1 className="text-lg font-bold text-gray-800 mb-5">ログ</h1>

      {/* カード：幅はダッシュボードセクションと同一、高さ = Stats + gap + Chart */}
      <div
        className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
        style={{ height: CARD_H }}
      >
        <div className="flex h-full">

          {/* ── 左：カレンダー（38%） ── */}
          <div className="w-[38%] border-r border-gray-200 overflow-hidden">
            <LogCalendar
              logs={logs}
              selected={selected}
              onSelect={handleSelect}
            />
          </div>

          {/* ── 右：ログ一覧（62%） ── */}
          <div className="flex-1 bg-gray-50 overflow-hidden">
            <DayLogList
              logs={logs}
              selected={selected}
              onToggleStatus={toggleStatus}
            />
          </div>

        </div>
      </div>
    </div>
  )
}
