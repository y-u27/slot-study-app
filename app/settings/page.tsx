'use client'

import { useEffect, useState } from 'react'
import {
  getContents,
  getDurations,
  saveContents,
  saveDurations,
} from '@/lib/store'
import type { StudyContent, StudyDuration } from '@/lib/types'

export default function SettingsPage() {
  const [contents, setContents] = useState<StudyContent[]>([])
  const [durations, setDurations] = useState<StudyDuration[]>([])
  const [newContent, setNewContent] = useState('')
  const [newMinutes, setNewMinutes] = useState('')
  const [editContentId, setEditContentId] = useState<string | null>(null)
  const [editContentName, setEditContentName] = useState('')
  const [editDurationId, setEditDurationId] = useState<string | null>(null)
  const [editDurationMinutes, setEditDurationMinutes] = useState('')

  useEffect(() => {
    setContents(getContents())
    setDurations(getDurations())
  }, [])

  // --- Content handlers ---
  const addContent = () => {
    const name = newContent.trim()
    if (!name) return
    const updated = [...contents, { id: crypto.randomUUID(), name }]
    setContents(updated)
    saveContents(updated)
    setNewContent('')
  }

  const deleteContent = (id: string) => {
    const updated = contents.filter((c) => c.id !== id)
    setContents(updated)
    saveContents(updated)
  }

  const startEditContent = (c: StudyContent) => {
    setEditContentId(c.id)
    setEditContentName(c.name)
  }

  const saveEditContent = () => {
    const name = editContentName.trim()
    if (!name || !editContentId) return
    const updated = contents.map((c) =>
      c.id === editContentId ? { ...c, name } : c
    )
    setContents(updated)
    saveContents(updated)
    setEditContentId(null)
    setEditContentName('')
  }

  // --- Duration handlers ---
  const addDuration = () => {
    const mins = parseInt(newMinutes, 10)
    if (!mins || mins <= 0) return
    const updated = [...durations, { id: crypto.randomUUID(), minutes: mins }]
    setDurations(updated)
    saveDurations(updated)
    setNewMinutes('')
  }

  const deleteDuration = (id: string) => {
    const updated = durations.filter((d) => d.id !== id)
    setDurations(updated)
    saveDurations(updated)
  }

  const startEditDuration = (d: StudyDuration) => {
    setEditDurationId(d.id)
    setEditDurationMinutes(String(d.minutes))
  }

  const saveEditDuration = () => {
    const mins = parseInt(editDurationMinutes, 10)
    if (!mins || mins <= 0 || !editDurationId) return
    const updated = durations.map((d) =>
      d.id === editDurationId ? { ...d, minutes: mins } : d
    )
    setDurations(updated)
    saveDurations(updated)
    setEditDurationId(null)
    setEditDurationMinutes('')
  }

  return (
    <div className="px-4 py-6 flex flex-col gap-8">
      <h1 className="text-xl font-bold text-gray-800">学習設定</h1>

      {/* Study Content */}
      <section>
        <h2 className="text-base font-semibold text-gray-700 mb-3">学習内容</h2>
        <ul className="flex flex-col gap-2 mb-3">
          {contents.map((c) => (
            <li key={c.id} className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-2">
              {editContentId === c.id ? (
                <>
                  <input
                    className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    value={editContentName}
                    onChange={(e) => setEditContentName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEditContent()}
                    autoFocus
                  />
                  <button onClick={saveEditContent} className="text-xs text-blue-600 font-medium px-2">保存</button>
                  <button onClick={() => setEditContentId(null)} className="text-xs text-gray-400 px-1">✕</button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm text-gray-700">{c.name}</span>
                  <button onClick={() => startEditContent(c)} className="text-xs text-gray-400 hover:text-blue-500 px-1">編集</button>
                  <button onClick={() => deleteContent(c.id)} className="text-xs text-gray-400 hover:text-red-500 px-1">削除</button>
                </>
              )}
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <input
            className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="例：数学"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addContent()}
          />
          <button
            onClick={addContent}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            追加
          </button>
        </div>
      </section>

      {/* Study Duration */}
      <section>
        <h2 className="text-base font-semibold text-gray-700 mb-3">学習時間（分）</h2>
        <ul className="flex flex-col gap-2 mb-3">
          {durations.map((d) => (
            <li key={d.id} className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-2">
              {editDurationId === d.id ? (
                <>
                  <input
                    type="number"
                    className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    value={editDurationMinutes}
                    onChange={(e) => setEditDurationMinutes(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEditDuration()}
                    min={1}
                    autoFocus
                  />
                  <span className="text-sm text-gray-500">分</span>
                  <button onClick={saveEditDuration} className="text-xs text-blue-600 font-medium px-2">保存</button>
                  <button onClick={() => setEditDurationId(null)} className="text-xs text-gray-400 px-1">✕</button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm text-gray-700">{d.minutes}分</span>
                  <button onClick={() => startEditDuration(d)} className="text-xs text-gray-400 hover:text-blue-500 px-1">編集</button>
                  <button onClick={() => deleteDuration(d.id)} className="text-xs text-gray-400 hover:text-red-500 px-1">削除</button>
                </>
              )}
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <input
            type="number"
            className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="例：30"
            value={newMinutes}
            onChange={(e) => setNewMinutes(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addDuration()}
            min={1}
          />
          <span className="flex items-center text-sm text-gray-500">分</span>
          <button
            onClick={addDuration}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            追加
          </button>
        </div>
      </section>
    </div>
  )
}
