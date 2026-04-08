'use client'

import { useEffect, useRef, useState } from 'react'

export const ITEM_H = 72  // px per reel cell

// ストリップは items を REPEATS 回繰り返した固定長。
// スピン中は posRef が WRAP_AT に達したら WRAP_BACK だけ戻す。
// このとき表示される 3 アイテム（上・中央・下）は wrap 前後で完全一致するため、
// duration=0 でスナップしても視覚的な変化はゼロ。
const REPEATS    = 5
const WRAP_AT    = 3   // n * WRAP_AT   ← この位置でラップ
const WRAP_BACK  = 2   // n * WRAP_BACK ← 戻す量

export interface ReelProps {
  items: string[]
  isSpinning: boolean
  stoppedValue: string | null
  label: string
}

export function Reel({ items, isSpinning, stoppedValue, label }: ReelProps) {
  const posRef         = useRef(0)
  // setInterval のクロージャからは常に最新の items を参照する
  const itemsRef       = useRef<string[]>(items)
  const [pos, setPos]              = useState(0)
  const [duration, setDuration]    = useState(0)
  const [settling, setSettling]    = useState(false)
  const timerRef       = useRef<ReturnType<typeof setInterval> | null>(null)
  const settleTimerRef = useRef<ReturnType<typeof setTimeout>  | null>(null)
  const rafRef         = useRef<number | null>(null)

  // レンダリングのたびに ref を最新値へ同期（クロージャ問題の根本対策）
  itemsRef.current = items

  useEffect(() => {
    let startTimerId: ReturnType<typeof setTimeout> | null = null

    if (isSpinning) {
      setSettling(false)

      // スピン開始時: posRef を先頭付近へ正規化（前回停止位置が大きい場合の対策）
      const n = items.length
      posRef.current = posRef.current % n
      setPos(posRef.current)
      setDuration(0)  // 正規化後の位置へスナップ（アニメーションなし）

      // スナップが描画されてからインターバル開始
      startTimerId = setTimeout(() => {
        setDuration(80)

        timerRef.current = setInterval(() => {
          posRef.current += 1

          const n       = itemsRef.current.length  // 常に最新の items 長を参照
          const wrapAt  = n * WRAP_AT
          const wrapBack = n * WRAP_BACK

          if (posRef.current >= wrapAt) {
            // ─── シームレスラップ ───────────────────────────────────────
            // posRef を wrapBack だけ戻す。
            // ストリップは n アイテムの繰り返しなので、
            // 「中央セル = items[p % n]」「上セル = items[(p-1) % n]」「下セル = items[(p+1) % n]」
            // はすべて wrap 前後で一致 → 視覚変化なし。
            posRef.current -= wrapBack
            setDuration(0)          // スナップ（見た目の変化なし）
            setPos(posRef.current)
            rafRef.current = requestAnimationFrame(() => {
              setDuration(80)       // 次フレームからスムーズスクロール再開
              rafRef.current = null
            })
          } else {
            setPos(posRef.current)
          }
        }, 90)
      }, 50)

    } else {
      if (timerRef.current) clearInterval(timerRef.current)

      if (stoppedValue !== null) {
        const targetIdx = items.indexOf(stoppedValue)
        if (targetIdx !== -1) {
          const n   = items.length
          const cur = ((posRef.current % n) + n) % n
          let delta = targetIdx - cur
          if (delta <= 0) delta += n  // 常に前進方向で停止
          posRef.current += delta
          setDuration(500)
          setPos(posRef.current)
          setSettling(true)
          settleTimerRef.current = setTimeout(() => setSettling(false), 600)
        }
      }
    }

    return () => {
      if (startTimerId)           clearTimeout(startTimerId)
      if (timerRef.current)       clearInterval(timerRef.current)
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current)
      if (rafRef.current)         cancelAnimationFrame(rafRef.current)
    }
  }, [isSpinning, stoppedValue, items])

  const translateY = -(pos * ITEM_H) + ITEM_H

  return (
    <div className="flex flex-col items-center gap-2">
      <span
        className="text-[9px] font-bold tracking-[0.25em] uppercase"
        style={{ color: '#b8860b' }}
      >
        {label}
      </span>

      {/* reel window — 3 cells tall */}
      <div
        className="relative overflow-hidden rounded-lg"
        style={{
          width: 130,
          height: ITEM_H * 3,
          background: '#0a0a14',
          border: '2px solid #7a5c00',
          boxShadow:
            'inset 0 0 24px rgba(0,0,0,0.95), ' +
            '0 0 12px rgba(184,134,11,0.2)',
        }}
      >
        {/* scrolling strip — REPEATS copies of items */}
        <div
          style={{
            transform: `translateY(${translateY}px)`,
            transition: `transform ${duration}ms ${isSpinning ? 'linear' : 'cubic-bezier(0.2, 0.8, 0.4, 1)'}`,
          }}
        >
          {Array.from({ length: REPEATS }, () => items).flat().map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-center text-center px-2 leading-tight"
              style={{ height: ITEM_H }}
            >
              <span
                className="font-bold text-white"
                style={{ fontSize: item.length > 6 ? 13 : 16 }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>

        {/* top fade */}
        <div
          className="absolute inset-x-0 top-0 pointer-events-none"
          style={{
            height: ITEM_H,
            background: 'linear-gradient(180deg, rgba(10,10,20,1) 30%, rgba(10,10,20,0) 100%)',
            zIndex: 10,
          }}
        />

        {/* bottom fade */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: ITEM_H,
            background: 'linear-gradient(0deg, rgba(10,10,20,1) 30%, rgba(10,10,20,0) 100%)',
            zIndex: 10,
          }}
        />

        {/* winning-line highlight */}
        <div
          className="absolute inset-x-0 pointer-events-none"
          style={{
            top: ITEM_H,
            height: ITEM_H,
            borderTop:    `1px solid rgba(212,168,32,${settling ? 0.9 : 0.35})`,
            borderBottom: `1px solid rgba(212,168,32,${settling ? 0.9 : 0.35})`,
            background:   `rgba(212,168,32,${settling ? 0.12 : 0.04})`,
            transition:   'border-color 0.3s, background 0.3s',
            zIndex: 20,
          }}
        />

        {/* horizontal line overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.12) 4px)',
            zIndex: 30,
          }}
        />

        {/* spinning shimmer */}
        {isSpinning && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(180deg, rgba(255,255,255,0.03) 50%, transparent 50%)',
              backgroundSize: '100% 8px',
              animation: 'shimmer-scroll 0.15s linear infinite',
              zIndex: 25,
            }}
          />
        )}

        {/* settle flash */}
        {settling && (
          <div
            className="absolute inset-0 pointer-events-none rounded-lg"
            style={{
              boxShadow: 'inset 0 0 20px rgba(212,168,32,0.3)',
              animation: 'settle-flash 0.5s ease-out forwards',
              zIndex: 35,
            }}
          />
        )}
      </div>
    </div>
  )
}
