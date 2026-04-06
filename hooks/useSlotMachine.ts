import { useCallback, useEffect, useState } from 'react'
import { addLog, getAchievementRate, getContents, getDurations } from '@/lib/store'
import type { StudyContent, StudyDuration } from '@/lib/types'

// ─── Types ──────────────────────────────────────────────────────────────────

export type SlotState = 'idle' | 'spinning' | 'stopped'

export interface Evo {
  accent: string
  glow: string
  label: string
}

export interface UseSlotMachineReturn {
  contentNames: string[]
  durationLabels: string[]
  state: SlotState
  reel1Stopped: boolean
  reel2Stopped: boolean
  result1: StudyContent | null
  result2: StudyDuration | null
  showResult: boolean
  saved: boolean
  achievementRate: number
  isSpinning: boolean
  evo: Evo
  hasItems: boolean
  handleStart: () => void
  handleStop1: () => void
  handleStop2: () => void
  handleRecord: () => void
  handleRetry: () => void
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getEvo(rate: number): Evo {
  if (rate < 30) return { label: 'ボロボロ', accent: '#6b7280', glow: 'rgba(107,114,128,0.25)' }
  if (rate < 60) return { label: '少し改善',  accent: '#22c55e', glow: 'rgba(34,197,94,0.3)'   }
  if (rate < 80) return { label: '通常',      accent: '#3b82f6', glow: 'rgba(59,130,246,0.35)'  }
  return           { label: '豪華',      accent: '#d4a820', glow: 'rgba(212,168,32,0.5)'   }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useSlotMachine(): UseSlotMachineReturn {
  const [contents,  setContents]  = useState<StudyContent[]>([])
  const [durations, setDurations] = useState<StudyDuration[]>([])
  const [state,     setState]     = useState<SlotState>('idle')
  const [reel1Stopped, setReel1Stopped] = useState(false)
  const [reel2Stopped, setReel2Stopped] = useState(false)
  const [result1,   setResult1]   = useState<StudyContent | null>(null)
  const [result2,   setResult2]   = useState<StudyDuration | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [saved,     setSaved]     = useState(false)
  const [achievementRate, setAchievementRate] = useState(0)

  useEffect(() => {
    setContents(getContents())
    setDurations(getDurations())
    setAchievementRate(getAchievementRate())
  }, [])

  const pickRandom = useCallback(
    <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)],
    [],
  )

  const handleStart = useCallback(() => {
    if (!contents.length || !durations.length) return
    setReel1Stopped(false)
    setReel2Stopped(false)
    setResult1(null)
    setResult2(null)
    setShowResult(false)
    setSaved(false)
    setState('spinning')
  }, [contents.length, durations.length])

  const handleStop1 = useCallback(() => {
    if (state !== 'spinning' || reel1Stopped) return
    setResult1(pickRandom(contents))
    setReel1Stopped(true)
  }, [state, reel1Stopped, pickRandom, contents])

  const handleStop2 = useCallback(() => {
    if (state !== 'spinning' || reel2Stopped) return
    setResult2(pickRandom(durations))
    setReel2Stopped(true)
  }, [state, reel2Stopped, pickRandom, durations])

  useEffect(() => {
    if (reel1Stopped && reel2Stopped && state === 'spinning') {
      setTimeout(() => {
        setState('stopped')
        setShowResult(true)
      }, 650)
    }
  }, [reel1Stopped, reel2Stopped, state])

  const handleRecord = useCallback(() => {
    if (!result1 || !result2) return
    addLog({
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0],
      contentId:      result1.id,
      contentName:    result1.name,
      durationId:     result2.id,
      durationMinutes: result2.minutes,
      status: false,
    })
    setSaved(true)
    setAchievementRate(getAchievementRate())
  }, [result1, result2])

  const handleRetry = useCallback(() => {
    setReel1Stopped(false)
    setReel2Stopped(false)
    setResult1(null)
    setResult2(null)
    setShowResult(false)
    setSaved(false)
    setState('idle')
  }, [])

  return {
    contentNames:   contents.map(c => c.name),
    durationLabels: durations.map(d => `${d.minutes}分`),
    state,
    reel1Stopped,
    reel2Stopped,
    result1,
    result2,
    showResult,
    saved,
    achievementRate,
    isSpinning: state === 'spinning',
    evo:        getEvo(achievementRate),
    hasItems:   contents.length > 0 && durations.length > 0,
    handleStart,
    handleStop1,
    handleStop2,
    handleRecord,
    handleRetry,
  }
}
