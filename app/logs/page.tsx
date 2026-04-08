'use client'

import { useEffect, useState } from 'react'
import { fetchLogs, updateLogStatus } from '@/lib/supabaseStore'
import type { StudyLogRow } from '@/lib/types'

export default function LogsPage() {
  const [logs, setLogs] = useState<StudyLogRow[]>([])

  useEffect(() => {
    fetchLogs().then(setLogs)
  }, [])

  const toggleStatus = async (id: string, current: boolean) => {
    const next = !current
    await updateLogStatus(id, next)
    setLogs((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: next } : l))
    )
  }

  return (
    <div className="px-4 py-6 flex flex-col gap-4">
      <h1 className="text-xl font-bold text-gray-800">学習ログ</h1>

      {logs.length === 0 ? (
        <div className="text-center text-gray-400 py-16">
          <p className="text-4xl mb-3">📋</p>
          <p>まだ記録がありません</p>
          <p className="text-sm mt-1">スロットで学習内容を決めて記録しましょう</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {logs.map((log) => (
            <li
              key={log.id}
              className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-3 shadow-sm"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{log.content}</p>
                <p className="text-sm text-gray-500">
                  {log.duration}分 &nbsp;·&nbsp; {log.created_at.split('T')[0]}
                </p>
              </div>
              <button
                onClick={() => toggleStatus(log.id, log.status)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  log.status
                    ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-200'
                }`}
              >
                {log.status ? '✅ 達成' : '未達成'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
