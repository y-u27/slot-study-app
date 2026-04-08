'use client'

import type { ReactNode } from 'react'
import type { Evo, SlotState } from '@/hooks/useSlotMachine'
import { CabinetLights } from './CabinetLights'

// ─── Stage styles ─────────────────────────────────────────────────

interface StageStyle {
  background: string
  borderWidth: number
  borderStyle: 'dashed' | 'solid'
  borderColor: string
  /** boxShadow or animation name */
  shadow: string
  /** CSS filter applied to the entire machine */
  filter: string
  headerBg: string
  titleColor: string
  titleGlow: string
  subtitleColor: string
  /** Run gold-pulse animation on the cabinet */
  animate: boolean
}

function getStage(rate: number): StageStyle {
  /* ── Stage 1: ボロボロ ── */
  if (rate < 30) return {
    background: '#181818',
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: '#505050',
    shadow: 'none',
    filter: 'grayscale(0.9) brightness(0.55)',
    headerBg: '#1e1e1e',
    titleColor: '#666666',
    titleGlow: 'none',
    subtitleColor: '#444444',
    animate: false,
  }
  /* ── Stage 2: 改善途中 ── */
  if (rate < 60) return {
    background: 'linear-gradient(170deg, #0a1a0c 0%, #071009 100%)',
    borderWidth: 3,
    borderStyle: 'solid',
    borderColor: '#2f6e30',
    shadow: '0 0 22px rgba(47,110,48,0.3), 0 18px 45px rgba(0,0,0,0.55)',
    filter: 'grayscale(0.3)',
    headerBg: 'rgba(74,222,128,0.04)',
    titleColor: '#4ade80',
    titleGlow: '0 0 12px rgba(74,222,128,0.45)',
    subtitleColor: 'rgba(74,222,128,0.45)',
    animate: false,
  }
  /* ── Stage 3: 通常 ── */
  if (rate < 80) return {
    background: 'linear-gradient(170deg, #1a1040 0%, #0d0820 60%, #120830 100%)',
    borderWidth: 3,
    borderStyle: 'solid',
    borderColor: '#3b82f6',
    shadow: '0 0 35px rgba(59,130,246,0.35), 0 24px 60px rgba(0,0,0,0.6)',
    filter: 'none',
    headerBg: 'rgba(255,255,255,0.06)',
    titleColor: '#d4a820',
    titleGlow: '0 0 18px rgba(212,168,32,0.55)',
    subtitleColor: 'rgba(180,140,20,0.6)',
    animate: false,
  }
  /* ── Stage 4: 豪華 ── */
  return {
    background: 'linear-gradient(170deg, #2a1060 0%, #1a0840 50%, #200a30 100%)',
    borderWidth: 3,
    borderStyle: 'solid',
    borderColor: '#d4a820',
    shadow: '0 0 50px rgba(212,168,32,0.5), 0 24px 60px rgba(0,0,0,0.7)',
    filter: 'none',
    headerBg: 'rgba(212,168,32,0.08)',
    titleColor: '#ffd700',
    titleGlow: '0 0 20px rgba(255,215,0,0.8), 0 0 40px rgba(255,215,0,0.3)',
    subtitleColor: 'rgba(212,168,32,0.65)',
    animate: true,
  }
}

// ─── Component ────────────────────────────────────────────────────

interface CabinetProps {
  evo: Evo
  achievementRate: number
  isSpinning: boolean
  state: SlotState
  reels: ReactNode
  controls: ReactNode
}

export function Cabinet({
  evo,
  achievementRate,
  isSpinning,
  state,
  reels,
  controls,
}: CabinetProps) {
  const s = getStage(achievementRate)

  return (
    <div
      className="w-full max-w-sm rounded-3xl overflow-hidden"
      style={{
        background:  s.background,
        border:      `${s.borderWidth}px ${s.borderStyle} ${s.borderColor}`,
        boxShadow:   s.shadow,
        filter:      s.filter,
        animation:   s.animate ? 'gold-pulse 2.5s ease-in-out infinite' : 'none',
        transition:  'filter 0.8s ease, box-shadow 0.8s ease, border-color 0.8s ease',
      }}
    >
      {/* ── Header ── */}
      <div
        className="px-5 pt-5 pb-4 text-center"
        style={{
          background:   s.headerBg,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          transition:   'background 0.8s ease',
        }}
      >
        <CabinetLights active={isSpinning} />
        <h1
          className="text-2xl font-black tracking-[0.18em] uppercase"
          style={{ color: s.titleColor, textShadow: s.titleGlow, transition: 'color 0.8s' }}
        >
          Study Slot
        </h1>
        <p
          className="text-[10px] tracking-widest mt-1"
          style={{ color: s.subtitleColor, transition: 'color 0.8s' }}
        >
          達成率 {achievementRate}%　·　{evo.label}
        </p>
      </div>

      {/* ── Reel area (always shown) ── */}
      <div className="px-5 py-6">{reels}</div>

      {/* ── Controls — only when idle (START button) ── */}
      {state === 'idle' && (
        <div
          className="px-5 pb-6"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          {controls}
        </div>
      )}
    </div>
  )
}
