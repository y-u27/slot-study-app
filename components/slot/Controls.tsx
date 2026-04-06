"use client";

import type { SlotState } from "@/hooks/useSlotMachine";

interface ControlsProps {
  state: SlotState;
  reel1Stopped: boolean;
  reel2Stopped: boolean;
  onStart: () => void;
  onStop1: () => void;
  onStop2: () => void;
}

const STOP_BUTTONS = [
  { label: "学習内容", key: "content" },
  { label: "学習時間", key: "duration" },
] as const;

export function Controls({
  state,
  reel1Stopped,
  reel2Stopped,
  onStart,
  onStop1,
  onStop2,
}: ControlsProps) {
  const stopConfig = [
    { ...STOP_BUTTONS[0], stopped: reel1Stopped, fn: onStop1 },
    { ...STOP_BUTTONS[1], stopped: reel2Stopped, fn: onStop2 },
  ];

  return (
    <>
      {/* START */}
      {state === "idle" && (
        <button
          onClick={onStart}
          className="w-full py-4 rounded-2xl font-black text-lg tracking-widest uppercase transition-all duration-100 active:scale-[0.97] mt-4"
          style={{
            background:
              "linear-gradient(180deg, #2ecc71 0%, #27ae60 50%, #1e8449 100%)",
            color: "#fff",
            boxShadow: "0 5px 0 #145a32, 0 8px 24px rgba(46,204,113,0.35)",
            border: "1px solid rgba(255,255,255,0.25)",
            textShadow: "0 1px 3px rgba(0,0,0,0.4)",
          }}
        >
          ▶ START
        </button>
      )}

      {/* STOP buttons */}
      {state === "spinning" && (
        <div className="flex gap-3 mt-4">
          {stopConfig.map(({ label, key, stopped, fn }) => (
            <button
              key={key}
              onClick={fn}
              disabled={stopped}
              className="flex-1 py-3 rounded-2xl font-bold text-sm transition-all duration-100 active:scale-[0.97] flex flex-col items-center gap-0.5"
              style={
                stopped
                  ? {
                      background: "#1e1e30",
                      color: "#4b5563",
                      border: "1px solid #2d2d45",
                      cursor: "not-allowed",
                    }
                  : {
                      background:
                        "linear-gradient(180deg, #e74c3c 0%, #c0392b 50%, #96281b 100%)",
                      color: "#fff",
                      boxShadow:
                        "0 4px 0 #641e16, 0 6px 20px rgba(231,76,60,0.4)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      textShadow: "0 1px 2px rgba(0,0,0,0.4)",
                      animation: "pulse-glow 1.2s ease-in-out infinite",
                    }
              }
            >
              <span>{stopped ? "停止済" : "STOP"}</span>
              {!stopped && (
                <span style={{ fontSize: 10, opacity: 0.75 }}>{label}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
