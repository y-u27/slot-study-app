import type { StudyContent, StudyDuration, StudyLog } from './types'

const KEYS = {
  contents: 'slot_study_contents',
  durations: 'slot_study_durations',
  logs: 'slot_study_logs',
}

const DEFAULT_CONTENTS: StudyContent[] = [
  { id: '1', name: '英会話' },
  { id: '2', name: 'プログラミング' },
  { id: '3', name: '数学' },
  { id: '4', name: '読書' },
  { id: '5', name: 'リスニング' },
]

const DEFAULT_DURATIONS: StudyDuration[] = [
  { id: '1', minutes: 10 },
  { id: '2', minutes: 15 },
  { id: '3', minutes: 20 },
  { id: '4', minutes: 30 },
  { id: '5', minutes: 45 },
  { id: '6', minutes: 60 },
]

function get<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function set<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

export function getContents(): StudyContent[] {
  const stored = get<StudyContent[] | null>(KEYS.contents, null)
  if (!stored) {
    set(KEYS.contents, DEFAULT_CONTENTS)
    return DEFAULT_CONTENTS
  }
  return stored
}

export function saveContents(contents: StudyContent[]): void {
  set(KEYS.contents, contents)
}

export function getDurations(): StudyDuration[] {
  const stored = get<StudyDuration[] | null>(KEYS.durations, null)
  if (!stored) {
    set(KEYS.durations, DEFAULT_DURATIONS)
    return DEFAULT_DURATIONS
  }
  return stored
}

export function saveDurations(durations: StudyDuration[]): void {
  set(KEYS.durations, durations)
}

export function getLogs(): StudyLog[] {
  return get<StudyLog[]>(KEYS.logs, [])
}

export function addLog(log: StudyLog): void {
  const logs = getLogs()
  set(KEYS.logs, [log, ...logs])
}

export function updateLogStatus(id: string, status: boolean): void {
  const logs = getLogs()
  set(
    KEYS.logs,
    logs.map((l) => (l.id === id ? { ...l, status } : l))
  )
}

export function getAchievementRate(): number {
  const logs = getLogs()
  if (logs.length === 0) return 0
  const achieved = logs.filter((l) => l.status).length
  return Math.round((achieved / logs.length) * 100)
}
