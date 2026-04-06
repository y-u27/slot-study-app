"use client";

import { Reel } from "./Reel";

interface ReelAreaProps {
  contentNames: string[];
  durationLabels: string[];
  isSpinning: boolean;
  reel1Stopped: boolean;
  reel2Stopped: boolean;
  result1Name: string | null;
  result2Label: string | null;
}

export function ReelArea({
  contentNames,
  durationLabels,
  isSpinning,
  reel1Stopped,
  reel2Stopped,
  result1Name,
  result2Label,
}: ReelAreaProps) {
  return (
    <div className="flex justify-center items-center gap-3">
      <Reel
        items={contentNames}
        isSpinning={isSpinning && !reel1Stopped}
        stoppedValue={result1Name}
        label="学習内容"
      />

      {/* center separator */}
      <div
        style={{
          width: 2,
          height: 80,
          marginTop: 22,
          background:
            "linear-gradient(180deg, transparent, #7a5c00 40%, #7a5c00 60%, transparent)",
        }}
      />

      <Reel
        items={durationLabels}
        isSpinning={isSpinning && !reel2Stopped}
        stoppedValue={result2Label}
        label="学習時間"
      />
    </div>
  );
}
