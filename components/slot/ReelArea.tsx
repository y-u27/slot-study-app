'use client'

import type { SlotState } from '@/hooks/useSlotMachine'
import { Reel } from './Reel'

interface ReelAreaProps {
  contentNames: string[]
  durationLabels: string[]
  isSpinning: boolean
  reel1Stopped: boolean
  reel2Stopped: boolean
  result1Name: string | null
  result2Label: string | null
  state: SlotState
  onStop1: () => void
  onStop2: () => void
}

interface StopButtonProps {
  stopped: boolean
  onClick: () => void
}

function StopButton({ stopped, onClick }: StopButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={stopped}
      className="w-28 py-2.5 rounded-xl font-bold text-sm flex flex-col items-center gap-0.5 transition-all duration-100 active:scale-[0.96]"
      style={
        stopped
          ? {
              background: '#1e1e30',
              color: '#4b5563',
              border: '1px solid #2d2d45',
              cursor: 'not-allowed',
            }
          : {
              background: 'linear-gradient(180deg, #e74c3c 0%, #c0392b 50%, #96281b 100%)',
              color: '#fff',
              boxShadow: '0 4px 0 #641e16, 0 6px 20px rgba(231,76,60,0.4)',
              border: '1px solid rgba(255,255,255,0.2)',
              textShadow: '0 1px 2px rgba(0,0,0,0.4)',
              animation: 'pulse-glow 1.4s ease-in-out infinite',
            }
      }
    >
      <span>{stopped ? '停止済' : 'STOP'}</span>
    </button>
  )
}

export function ReelArea({
  contentNames,
  durationLabels,
  isSpinning,
  reel1Stopped,
  reel2Stopped,
  result1Name,
  result2Label,
  state,
  onStop1,
  onStop2,
}: ReelAreaProps) {
  const spinning = state === 'spinning'

  return (
    <div className="flex justify-center items-start gap-3">
      {/* ── Reel 1 + STOP ── */}
      <div className="flex flex-col items-center gap-3">
        <Reel
          items={contentNames}
          isSpinning={isSpinning && !reel1Stopped}
          stoppedValue={result1Name}
          label="学習内容"
        />
        {spinning && (
          <StopButton stopped={reel1Stopped} onClick={onStop1} />
        )}
      </div>

      {/* ── Separator ── */}
      <div
        style={{
          width: 2,
          height: 80,
          marginTop: 26,
          background:
            'linear-gradient(180deg, transparent, #7a5c00 40%, #7a5c00 60%, transparent)',
          flexShrink: 0,
        }}
      />

      {/* ── Reel 2 + STOP ── */}
      <div className="flex flex-col items-center gap-3">
        <Reel
          items={durationLabels}
          isSpinning={isSpinning && !reel2Stopped}
          stoppedValue={result2Label}
          label="学習時間"
        />
        {spinning && (
          <StopButton stopped={reel2Stopped} onClick={onStop2} />
        )}
      </div>
    </div>
  )
}
