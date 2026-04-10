'use client'

import type { StudyLogRow } from '@/lib/types'

interface StatsSectionProps {
  logs: StudyLogRow[]
  achievementRate: number
}

export function StatsSection({ logs, achievementRate }: StatsSectionProps) {
  const totalAchieved = logs.filter((l) => l.status).length

  const barColor =
    achievementRate >= 80
      ? 'linear-gradient(90deg, #fbbf24, #f59e0b)'
      : achievementRate >= 60
      ? 'linear-gradient(90deg, #60a5fa, #3b82f6)'
      : achievementRate >= 30
      ? 'linear-gradient(90deg, #86efac, #22c55e)'
      : 'linear-gradient(90deg, #d1d5db, #9ca3af)'

  const stageLabel =
    achievementRate >= 80 ? '👑 豪華スロット解放中！' :
    achievementRate >= 60 ? '🎰 通常スロット' :
    achievementRate >= 30 ? '✨ 少し改善' : '🔧 もっと頑張ろう'

  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col gap-4">
      <h2 className="text-sm font-bold text-gray-700 tracking-wide">📊 ステータス</h2>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-2xl font-bold text-gray-800">{logs.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">記録数</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-100 p-3 text-center">
          <p className="text-2xl font-bold text-green-600">{totalAchieved}</p>
          <p className="text-xs text-gray-500 mt-0.5">達成数</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-3 text-center">
          <p className="text-2xl font-bold text-blue-600">{achievementRate}%</p>
          <p className="text-xs text-gray-500 mt-0.5">達成率</p>
        </div>
      </div>

      {/* Achievement rate bar */}
      <div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 rounded-full transition-all duration-700"
            style={{ width: `${achievementRate}%`, background: barColor }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1.5">{stageLabel}</p>
      </div>
    </section>
  )
}
