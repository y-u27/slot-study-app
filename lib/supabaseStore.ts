import { supabase } from './supabase'
import type { StudyLogRow } from './types'

function logError(label: string, error: { message?: string; code?: string; details?: string; hint?: string }) {
  console.error(`${label} [${error.code ?? '?'}] ${error.message ?? '(no message)'}`, error.details ?? '', error.hint ?? '')
}

export async function fetchLogs(): Promise<StudyLogRow[]> {
  const { data, error } = await supabase
    .from('study_logs')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) {
    logError('fetchLogs error:', error)
    return []
  }
  return data ?? []
}

export async function insertLog(log: {
  content: string
  duration: number
  status: boolean
}): Promise<{ error: unknown }> {
  const { error } = await supabase.from('study_logs').insert(log)
  if (error) logError('insertLog error:', error)
  return { error }
}

export async function updateLogStatus(id: string, status: boolean): Promise<void> {
  const { error } = await supabase
    .from('study_logs')
    .update({ status })
    .eq('id', id)
  if (error) logError('updateLogStatus error:', error)
}

export async function fetchAchievementRate(): Promise<number> {
  const logs = await fetchLogs()
  if (logs.length === 0) return 0
  const achieved = logs.filter((l) => l.status).length
  return Math.round((achieved / logs.length) * 100)
}
