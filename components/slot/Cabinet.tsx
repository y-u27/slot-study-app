'use client'

import type { ReactNode } from 'react'
import type { Evo } from '@/hooks/useSlotMachine'
import { CabinetLights } from './CabinetLights'

interface CabinetProps {
  evo: Evo
  achievementRate: number
  isSpinning: boolean
  reels: ReactNode
  controls: ReactNode
}

export function Cabinet({ evo, achievementRate, isSpinning, reels, controls }: CabinetProps) {
  return (
    <div className="w-full max-w-sm rounded-3xl overflow-hidden"
         style={{
           background: 'linear-gradient(170deg, #1a1040 0%, #0d0820 60%, #120830 100%)',
           border: `3px solid ${evo.accent}`,
           boxShadow: `0 0 35px ${evo.glow}, 0 24px 60px rgba(0,0,0,0.6)`,
           transition: 'border-color 0.6s, box-shadow 0.6s',
         }}>

      {/* Header */}
      <div className="px-5 pt-5 pb-4 text-center"
           style={{
             background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%)',
             borderBottom: '1px solid rgba(255,255,255,0.06)',
           }}>
        <CabinetLights active={isSpinning} />
        <h1 className="text-2xl font-black tracking-[0.18em] uppercase"
            style={{ color: '#d4a820', textShadow: '0 0 18px rgba(212,168,32,0.55)' }}>
          Study Slot
        </h1>
        <p className="text-[10px] tracking-widest mt-1"
           style={{ color: 'rgba(180,140,20,0.6)' }}>
          達成率 {achievementRate}%　·　{evo.label}
        </p>
      </div>

      {/* Reel area */}
      <div className="px-5 py-6">
        {reels}
      </div>

      {/* Controls */}
      <div className="px-5 pb-6 flex flex-col gap-3"
           style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        {controls}
      </div>
    </div>
  )
}
