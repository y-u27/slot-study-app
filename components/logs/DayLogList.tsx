'use client'

import type { StudyLogRow } from '@/lib/types'

interface DayLogListProps {
  logs: StudyLogRow[]          // all logs
  selected: string | null      // "YYYY-MM-DD" or null = show all
  onToggleStatus: (id: string, current: boolean) => Promise<void>
}

export function DayLogList({ logs, selected, onToggleStatus }: DayLogListProps) {
  const filtered = selected
    ? logs.filter((l) => l.created_at?.startsWith(selected))
    : logs

  const headerLabel = selected
    ? `${selected.slice(5).replace('-', '/')} のログ`
    : 'すべてのログ'

  const achieved  = filtered.filter((l) => l.status).length
  const total     = filtered.length

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-gray-100">
        <p className="text-xs font-bold text-gray-700">{headerLabel}</p>
        {total > 0 && (
          <p className="text-[10px] text-gray-400 mt-0.5">
            {total}件 &nbsp;·&nbsp; 達成 {achieved}/{total}
          </p>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-300 gap-2 py-12">
            <span className="text-3xl">📭</span>
            <p className="text-xs">
              {selected ? 'この日の記録はありません' : 'まだ記録がありません'}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col divide-y divide-gray-50">
            {filtered.map((log) => (
              <li key={log.id} className="flex items-center gap-2 px-3 py-2.5">
                {/* Status dot */}
                <span
                  className={`shrink-0 w-2 h-2 rounded-full ${
                    log.status ? 'bg-green-400' : 'bg-gray-200'
                  }`}
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">
                    {log.content}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {log.duration}分
                    {log.created_at && (
                      <> · {log.created_at.split('T')[0]}</>
                    )}
                  </p>
                </div>

                {/* Toggle button */}
                <button
                  onClick={() => onToggleStatus(log.id, log.status)}
                  className={`shrink-0 px-2 py-1 rounded-full text-[10px] font-semibold border transition-colors ${
                    log.status
                      ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
                      : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {log.status ? '達成' : '未達成'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
