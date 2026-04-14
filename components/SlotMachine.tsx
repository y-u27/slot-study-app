"use client";

import { useSlotMachine } from "@/hooks/useSlotMachine";
import { Cabinet } from "@/components/slot/Cabinet";
import { ReelArea } from "@/components/slot/ReelArea";
import { Controls } from "@/components/slot/Controls";
import { ResultPanel } from "@/components/slot/ResultPanel";

interface SlotMachineProps {
  achievementRate: number;
  onRecorded: () => Promise<void>;
}

export default function SlotMachine({
  achievementRate,
  onRecorded,
}: SlotMachineProps) {
  const {
    contentNames,
    durationLabels,
    state,
    reel1Stopped,
    reel2Stopped,
    result1,
    result2,
    showResult,
    saved,
    isSpinning,
    evo,
    hasItems,
    handleStart,
    handleStop1,
    handleStop2,
    handleRecord,
    handleRetry,
  } = useSlotMachine(achievementRate, onRecorded);

  if (!hasItems) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-400 text-sm bg-white rounded-2xl border border-gray-200 shadow-sm">
        設定から学習内容・時間を追加してください
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <Cabinet
        evo={evo}
        achievementRate={achievementRate}
        isSpinning={isSpinning}
        state={state}
        reels={
          <ReelArea
            contentNames={contentNames}
            durationLabels={durationLabels}
            isSpinning={isSpinning}
            reel1Stopped={reel1Stopped}
            reel2Stopped={reel2Stopped}
            result1Name={result1?.name ?? null}
            result2Label={result2 ? `${result2.minutes}分` : null}
            state={state}
            onStop1={handleStop1}
            onStop2={handleStop2}
          />
        }
        controls={<Controls state={state} onStart={handleStart} />}
      />

      {showResult && result1 && result2 && (
        <ResultPanel
          result1Name={result1.name}
          result2Minutes={result2.minutes}
          saved={saved}
          evo={evo}
          onRecord={handleRecord}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
}
