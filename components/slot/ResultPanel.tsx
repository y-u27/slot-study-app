"use client";

import type { Evo } from "@/hooks/useSlotMachine";

interface ResultPanelProps {
  result1Name: string;
  result2Minutes: number;
  saved: boolean;
  evo: Evo;
  onRecord: () => void;
  onRetry: () => void;
}

export function ResultPanel({
  result1Name,
  result2Minutes,
  saved,
  evo,
  onRecord,
  onRetry,
}: ResultPanelProps) {
  return (
    <div
      className="result-revealed w-full max-w-sm rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1a1040 0%, #0d0820 100%)",
        border: `2px solid ${evo.accent}`,
        boxShadow: `0 0 24px ${evo.glow}`,
      }}
    >
      {/* Result display */}
      <div className="px-6 py-5 text-center">
        <p
          className="text-[9px] tracking-[0.3em] uppercase mb-3"
          style={{ color: "rgba(180,140,20,0.6)" }}
        >
          Result
        </p>
        <div className="flex items-baseline justify-center gap-3">
          <span className="text-2xl font-black text-white">{result1Name}</span>
          <span className="text-lg font-bold" style={{ color: "#d4a820" }}>
            ×
          </span>
          <span className="text-2xl font-black" style={{ color: "#d4a820" }}>
            {result2Minutes}分
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 pb-5">
        {saved ? (
          <div
            className="record-success text-center py-3 rounded-xl"
            style={{
              background: "rgba(46,204,113,0.12)",
              border: "1px solid rgba(46,204,113,0.3)",
            }}
          >
            <span className="text-green-400 font-bold text-sm">
              ✅ 記録しました！
            </span>
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={onRecord}
              className="flex-1 py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.97]"
              style={{
                background: "linear-gradient(180deg, #2ecc71 0%, #1e8449 100%)",
                color: "#fff",
                boxShadow: "0 3px 0 #145a32",
              }}
            >
              記録する
            </button>
            <button
              onClick={onRetry}
              className="flex-1 py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.97]"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "#9ca3af",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              もう一度
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
