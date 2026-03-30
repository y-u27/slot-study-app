'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { addLog, getAchievementRate, getContents, getDurations } from '@/lib/store'
import type { StudyContent, StudyDuration } from '@/lib/types'

type SlotState = 'idle' | 'spinning' | 'stopped'

interface ReelProps {
  items: string[]
  isSpinning: boolean
  stoppedValue: string | null
  label: string
}

function Reel({ items, isSpinning, stoppedValue, label }: ReelProps) {
  const [displayIndex, setDisplayIndex] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (isSpinning) {
      intervalRef.current = setInterval(() => {
        setDisplayIndex((prev) => (prev + 1) % items.length)
      }, 80)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (stoppedValue !== null) {
        const idx = items.indexOf(stoppedValue)
        if (idx !== -1) setDisplayIndex(idx)
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isSpinning, stoppedValue, items])

  const prev = items[((displayIndex - 1) + items.length) % items.length]
  const current = items[displayIndex]
  const next = items[(displayIndex + 1) % items.length]

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{label}</span>
      <div
        className={`relative w-44 h-36 rounded-xl border-4 border-gray-300 bg-white overflow-hidden shadow-inner ${
          isSpinning ? 'reel-spinning' : ''
        }`}
      >
        {/* gradient overlays for 3D effect */}
        <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/90 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white/90 to-transparent z-10 pointer-events-none" />
        {/* center highlight line */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-12 border-y-2 border-blue-300/60 z-10 pointer-events-none" />

        <div className={`reel-items flex flex-col items-center justify-center h-full`}>
          <div className="text-sm text-gray-400 h-10 flex items-center">{prev}</div>
          <div className="text-lg font-bold text-gray-800 h-12 flex items-center text-center px-2 leading-tight">
            {current}
          </div>
          <div className="text-sm text-gray-400 h-10 flex items-center">{next}</div>
        </div>
      </div>
    </div>
  )
}

function getEvolutionClass(rate: number): string {
  if (rate < 30) return 'slot-broken'
  if (rate < 60) return 'slot-improved'
  if (rate < 80) return 'slot-normal'
  return 'slot-luxurious'
}

function getEvolutionLabel(rate: number): string {
  if (rate < 30) return '🔧 ボロボロ'
  if (rate < 60) return '✨ 少し改善'
  if (rate < 80) return '🎰 通常'
  return '👑 豪華'
}

export default function SlotMachine() {
  const [contents, setContents] = useState<StudyContent[]>([])
  const [durations, setDurations] = useState<StudyDuration[]>([])
  const [state, setState] = useState<SlotState>('idle')
  const [reel1Stopped, setReel1Stopped] = useState(false)
  const [reel2Stopped, setReel2Stopped] = useState(false)
  const [result1, setResult1] = useState<StudyContent | null>(null)
  const [result2, setResult2] = useState<StudyDuration | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [saved, setSaved] = useState(false)
  const [achievementRate, setAchievementRate] = useState(0)

  useEffect(() => {
    setContents(getContents())
    setDurations(getDurations())
    setAchievementRate(getAchievementRate())
  }, [])

  const contentNames = contents.map((c) => c.name)
  const durationLabels = durations.map((d) => `${d.minutes}分`)

  const pickRandom = useCallback(<T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)], [])

  const handleStart = () => {
    if (contents.length === 0 || durations.length === 0) return
    setReel1Stopped(false)
    setReel2Stopped(false)
    setResult1(null)
    setResult2(null)
    setShowResult(false)
    setSaved(false)
    setState('spinning')
  }

  const handleStop1 = () => {
    if (state !== 'spinning' || reel1Stopped) return
    const picked = pickRandom(contents)
    setResult1(picked)
    setReel1Stopped(true)
    if (reel2Stopped) {
      setState('stopped')
      setShowResult(true)
    }
  }

  const handleStop2 = () => {
    if (state !== 'spinning' || reel2Stopped) return
    const picked = pickRandom(durations)
    setResult2(picked)
    setReel2Stopped(true)
    if (reel1Stopped) {
      setState('stopped')
      setShowResult(true)
    }
  }

  // Auto-finalize when both reels are stopped
  useEffect(() => {
    if (reel1Stopped && reel2Stopped && state === 'spinning') {
      setState('stopped')
      setShowResult(true)
    }
  }, [reel1Stopped, reel2Stopped, state])

  const handleRecord = () => {
    if (!result1 || !result2) return
    addLog({
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0],
      contentId: result1.id,
      contentName: result1.name,
      durationId: result2.id,
      durationMinutes: result2.minutes,
      status: false,
    })
    setSaved(true)
    setAchievementRate(getAchievementRate())
  }

  const handleRetry = () => {
    setReel1Stopped(false)
    setReel2Stopped(false)
    setResult1(null)
    setResult2(null)
    setShowResult(false)
    setSaved(false)
    setState('idle')
  }

  const evClass = getEvolutionClass(achievementRate)
  const evLabel = getEvolutionLabel(achievementRate)
  const isSpinning = state === 'spinning'

  if (contentNames.length === 0 || durationLabels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <p>設定から学習内容・時間を追加してください</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6 py-8 px-4">
      {/* Evolution status */}
      <div className="text-sm font-medium text-gray-600">
        達成率 {achievementRate}% &nbsp;|&nbsp; {evLabel}
      </div>

      {/* Slot machine frame */}
      <div className={`w-full max-w-sm rounded-2xl border-4 p-6 transition-all duration-500 ${evClass}`}>
        <h2 className="text-center text-lg font-bold text-gray-700 mb-6">🎰 スタディスロット</h2>

        {/* Reels */}
        <div className="flex justify-center gap-4 mb-6">
          <Reel
            items={contentNames}
            isSpinning={isSpinning && !reel1Stopped}
            stoppedValue={result1?.name ?? null}
            label="学習内容"
          />
          <Reel
            items={durationLabels}
            isSpinning={isSpinning && !reel2Stopped}
            stoppedValue={result2 ? `${result2.minutes}分` : null}
            label="学習時間"
          />
        </div>

        {/* Control buttons */}
        {state === 'idle' && (
          <button
            onClick={handleStart}
            className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg shadow-md transition-colors"
          >
            START
          </button>
        )}

        {isSpinning && (
          <div className="flex gap-3">
            <button
              onClick={handleStop1}
              disabled={reel1Stopped}
              className={`flex-1 py-3 rounded-xl font-bold text-white shadow-md transition-all ${
                reel1Stopped
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600 stop-btn-active'
              }`}
            >
              {reel1Stopped ? '停止済' : 'STOP'}
            </button>
            <button
              onClick={handleStop2}
              disabled={reel2Stopped}
              className={`flex-1 py-3 rounded-xl font-bold text-white shadow-md transition-all ${
                reel2Stopped
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600 stop-btn-active'
              }`}
            >
              {reel2Stopped ? '停止済' : 'STOP'}
            </button>
          </div>
        )}
      </div>

      {/* Result */}
      {showResult && result1 && result2 && (
        <div className="result-revealed w-full max-w-sm bg-white rounded-2xl border-2 border-blue-200 p-6 shadow-lg text-center">
          <p className="text-sm text-gray-500 mb-2">結果</p>
          <p className="text-2xl font-bold text-gray-800 mb-1">
            {result1.name}
          </p>
          <p className="text-xl font-semibold text-blue-600 mb-6">
            × {result2.minutes}分
          </p>

          {saved ? (
            <div className="text-green-600 font-medium">✅ 記録しました！</div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleRecord}
                className="flex-1 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold shadow-md transition-colors"
              >
                記録する
              </button>
              <button
                onClick={handleRetry}
                className="flex-1 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold shadow-md transition-colors"
              >
                もう一度
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
