"use client";

import { useEffect, useRef, useState } from "react";

export const ITEM_H = 72; // px per reel cell

export interface ReelProps {
  items: string[];
  isSpinning: boolean;
  stoppedValue: string | null;
  label: string;
}

export function Reel({ items, isSpinning, stoppedValue, label }: ReelProps) {
  const posRef = useRef(0);
  const [pos, setPos] = useState(0);
  const [duration, setDuration] = useState(0);
  const [settling, setSettling] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isSpinning) {
      setSettling(false);
      setDuration(80);
      timerRef.current = setInterval(() => {
        posRef.current += 1;
        setPos(posRef.current);
      }, 90);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (stoppedValue !== null) {
        const targetIdx = items.indexOf(stoppedValue);
        if (targetIdx !== -1) {
          const n = items.length;
          const cur = ((posRef.current % n) + n) % n;
          let delta = targetIdx - cur;
          if (delta <= 0) delta += n; // always spin forward
          posRef.current += delta;
          setDuration(500);
          setPos(posRef.current);
          setSettling(true);
          setTimeout(() => setSettling(false), 600);
        }
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSpinning, stoppedValue, items]);

  const translateY = -(pos * ITEM_H) + ITEM_H;

  return (
    <div className="flex flex-col items-center gap-2">
      <span
        className="text-[9px] font-bold tracking-[0.25em] uppercase"
        style={{ color: "#b8860b" }}
      >
        {label}
      </span>

      {/* reel window — 3 cells tall */}
      <div
        className="relative overflow-hidden rounded-lg"
        style={{
          width: 130,
          height: ITEM_H * 3,
          background: "#0a0a14",
          border: "2px solid #7a5c00",
          boxShadow:
            "inset 0 0 24px rgba(0,0,0,0.95), " +
            "0 0 12px rgba(184,134,11,0.2)",
        }}
      >
        {/* scrolling strip */}
        <div
          style={{
            transform: `translateY(${translateY}px)`,
            transition: isSpinning
              ? `transform ${duration}ms linear`
              : `transform ${duration}ms cubic-bezier(0.2, 0.8, 0.4, 1)`,
          }}
        >
          {[...items, ...items, ...items, ...items, ...items].map((item, i) => (
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
            background:
              "linear-gradient(180deg, rgba(10,10,20,1) 30%, rgba(10,10,20,0) 100%)",
            zIndex: 10,
          }}
        />

        {/* bottom fade */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: ITEM_H,
            background:
              "linear-gradient(0deg, rgba(10,10,20,1) 30%, rgba(10,10,20,0) 100%)",
            zIndex: 10,
          }}
        />

        {/* winning-line highlight */}
        <div
          className="absolute inset-x-0 pointer-events-none"
          style={{
            top: ITEM_H,
            height: ITEM_H,
            borderTop: `1px solid rgba(212,168,32,${settling ? 0.9 : 0.35})`,
            borderBottom: `1px solid rgba(212,168,32,${settling ? 0.9 : 0.35})`,
            background: `rgba(212,168,32,${settling ? 0.12 : 0.04})`,
            transition: "border-color 0.3s, background 0.3s",
            zIndex: 20,
          }}
        />

        {/* horizontal line overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.12) 4px)",
            zIndex: 30,
          }}
        />

        {/* spinning shimmer */}
        {isSpinning && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(255,255,255,0.03) 50%, transparent 50%)",
              backgroundSize: "100% 8px",
              animation: "shimmer-scroll 0.15s linear infinite",
              zIndex: 25,
            }}
          />
        )}

        {/* settle flash */}
        {settling && (
          <div
            className="absolute inset-0 pointer-events-none rounded-lg"
            style={{
              boxShadow: "inset 0 0 20px rgba(212,168,32,0.3)",
              animation: "settle-flash 0.5s ease-out forwards",
              zIndex: 35,
            }}
          />
        )}
      </div>
    </div>
  );
}
