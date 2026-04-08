'use client'

import type { SlotState } from '@/hooks/useSlotMachine'

interface ControlsProps {
  state: SlotState
  onStart: () => void
}

export function Controls({ state, onStart }: ControlsProps) {
  if (state !== 'idle') return null

  return (
    <button
      onClick={onStart}
      className="w-full py-4 rounded-2xl font-black text-lg tracking-widest uppercase mt-4 transition-all duration-100 active:scale-[0.97]"
      style={{
        background: 'linear-gradient(180deg, #2ecc71 0%, #27ae60 50%, #1e8449 100%)',
        color: '#fff',
        boxShadow: '0 5px 0 #145a32, 0 8px 24px rgba(46,204,113,0.35)',
        border: '1px solid rgba(255,255,255,0.25)',
        textShadow: '0 1px 3px rgba(0,0,0,0.4)',
      }}
    >
      ▶ START
    </button>
  )
}
