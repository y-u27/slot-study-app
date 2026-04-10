'use client'

import type { StudyLogRow } from '@/lib/types'

interface LogsSectionProps {
  logs: StudyLogRow[]
  onToggleStatus: (id: string, current: boolean) => Promise<void>
}

export function LogsSection({ logs, onToggleStatus }: LogsSectionProps) {
  const recent = logs.slice(0, 10)

  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col gap-3">
      <h2 className="text-sm font-bold text-gray-700 tracking-wide">📋 最近のログ</h2>

      {recent.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          <p className="text-3xl mb-2">📭</p>
          <p className="text-sm">まだ記録がありません</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {recent.map((log) => (
            <li
              key={log.id}
              className="flex items-center gap-3 py-2.5 px-3 rounded-xl bg-gray-50 border border-gray-100"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-800 truncate">{log.content}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {log.duration}分
                  {log.created_at && (
                    <> &nbsp;·&nbsp; {log.created_at.split('T')[0]}</>
                  )}
                </p>
              </div>
              <button
                onClick={() => onToggleStatus(log.id, log.status)}
                className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors ${
                  log.status
                    ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                }`}
              >
                {log.status ? '✅ 達成' : '未達成'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
