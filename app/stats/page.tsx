'use client'

import { useEffect, useState } from 'react'
import { getLogs } from '@/lib/store'
import type { StudyLog } from '@/lib/types'

interface DayStat {
  date: string
  total: number
  achieved: number
}

function buildDayStats(logs: StudyLog[]): DayStat[] {
  const map = new Map<string, DayStat>()
  for (const log of logs) {
    const existing = map.get(log.date) ?? { date: log.date, total: 0, achieved: 0 }
    map.set(log.date, {
      ...existing,
      total: existing.total + 1,
      achieved: existing.achieved + (log.status ? 1 : 0),
    })
  }
  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date)).slice(-14)
}

export default function StatsPage() {
  const [logs, setLogs] = useState<StudyLog[]>([])

  useEffect(() => {
    setLogs(getLogs())
  }, [])

  const dayStats = buildDayStats(logs)
  const totalLogs = logs.length
  const totalAchieved = logs.filter((l) => l.status).length
  const achievementRate = totalLogs === 0 ? 0 : Math.round((totalAchieved / totalLogs) * 100)

  const maxTotal = Math.max(...dayStats.map((d) => d.total), 1)

  if (totalLogs === 0) {
    return (
      <div className="px-4 py-6">
        <h1 className="text-xl font-bold text-gray-800 mb-6">統計</h1>
        <div className="text-center text-gray-400 py-16">
          <p className="text-4xl mb-3">📊</p>
          <p>まだデータがありません</p>
          <p className="text-sm mt-1">学習を記録すると統計が表示されます</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 flex flex-col gap-6">
      <h1 className="text-xl font-bold text-gray-800">統計</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-3 text-center shadow-sm">
          <p className="text-2xl font-bold text-gray-800">{totalLogs}</p>
          <p className="text-xs text-gray-500 mt-0.5">記録数</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3 text-center shadow-sm">
          <p className="text-2xl font-bold text-green-600">{totalAchieved}</p>
          <p className="text-xs text-gray-500 mt-0.5">達成数</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3 text-center shadow-sm">
          <p className="text-2xl font-bold text-blue-600">{achievementRate}%</p>
          <p className="text-xs text-gray-500 mt-0.5">達成率</p>
        </div>
      </div>

      {/* Achievement rate bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <p className="text-sm font-semibold text-gray-700 mb-3">達成率</p>
        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
          <div
            className="h-4 rounded-full transition-all duration-700"
            style={{
              width: `${achievementRate}%`,
              background: achievementRate >= 80
                ? 'linear-gradient(90deg, #fbbf24, #f59e0b)'
                : achievementRate >= 60
                ? 'linear-gradient(90deg, #60a5fa, #3b82f6)'
                : achievementRate >= 30
                ? 'linear-gradient(90deg, #86efac, #22c55e)'
                : 'linear-gradient(90deg, #d1d5db, #9ca3af)',
            }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {achievementRate >= 80 ? '👑 豪華スロット解放中！' :
           achievementRate >= 60 ? '🎰 通常スロット' :
           achievementRate >= 30 ? '✨ 少し改善' : '🔧 もっと頑張ろう'}
        </p>
      </div>

      {/* Daily bar chart */}
      {dayStats.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm font-semibold text-gray-700 mb-4">日別達成数（直近14日）</p>
          <div className="flex items-end gap-1.5 h-32">
            {dayStats.map((d) => {
              const heightPct = (d.total / maxTotal) * 100
              const achievedPct = d.total === 0 ? 0 : (d.achieved / d.total) * 100
              return (
                <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-sm bg-gray-100 relative overflow-hidden"
                    style={{ height: `${Math.max(heightPct, 8)}%` }}
                    title={`${d.date}: ${d.achieved}/${d.total}`}
                  >
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-green-400 transition-all duration-500"
                      style={{ height: `${achievedPct}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-gray-400 rotate-45 origin-left w-6 truncate">
                    {d.date.slice(5)}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-green-400 inline-block" />達成</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-gray-200 inline-block" />未達成</span>
          </div>
        </div>
      )}
    </div>
  )
}
