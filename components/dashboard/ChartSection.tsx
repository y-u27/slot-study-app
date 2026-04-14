"use client";

import type { StudyLogRow } from "@/lib/types";

const MAX_BAR_H = 88; // px

interface DayStat {
  date: string;
  total: number;
  achieved: number;
}

function buildDayStats(logs: StudyLogRow[]): DayStat[] {
  const map = new Map<string, DayStat>();
  for (const log of logs) {
    const date = log.created_at ? log.created_at.split("T")[0] : "不明";
    const existing = map.get(date) ?? { date, total: 0, achieved: 0 };
    map.set(date, {
      ...existing,
      total: existing.total + 1,
      achieved: existing.achieved + (log.status ? 1 : 0),
    });
  }
  return Array.from(map.values())
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14);
}

interface ChartSectionProps {
  logs: StudyLogRow[];
}

export function ChartSection({ logs }: ChartSectionProps) {
  const dayStats = buildDayStats(logs);
  if (dayStats.length === 0) return null;

  const maxTotal = Math.max(...dayStats.map((d) => d.total), 1);

  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
      <h2 className="text-sm font-bold text-gray-700 tracking-wide mb-4">
        📅 日別達成数（直近14日）
      </h2>

      <div
        className="flex items-end gap-1.5"
        style={{ height: MAX_BAR_H + 32 }}
      >
        {dayStats.map((d) => {
          const barH = Math.max(
            Math.round((d.total / maxTotal) * MAX_BAR_H),
            6,
          );
          const greenH =
            d.total === 0 ? 0 : Math.round((d.achieved / d.total) * barH);
          const ratePct =
            d.total === 0 ? 0 : Math.round((d.achieved / d.total) * 100);

          return (
            <div
              key={d.date}
              className="flex-1 flex flex-col items-center gap-1"
            >
              {/* 達成率ラベル */}
              <span className="text-[8px] font-semibold text-gray-400 h-4 flex items-end">
                {ratePct > 0 ? `${ratePct}%` : ""}
              </span>

              {/* バー本体 */}
              <div
                className="w-full rounded-t relative overflow-hidden bg-gray-200"
                style={{ height: barH }}
                title={`${d.date}：${d.achieved}/${d.total}件達成`}
              >
                {/* 達成（緑）部分 - absoluteではなく下から積む */}
                <div
                  className="absolute bottom-0 left-0 right-0 bg-green-400 transition-all duration-500"
                  style={{ height: greenH }}
                />
              </div>

              {/* 日付ラベル */}
              <span className="text-[9px] text-gray-400 w-full text-center truncate">
                {d.date.length >= 7 ? d.date.slice(5) : d.date}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-green-400 inline-block" />
          達成
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-gray-200 inline-block" />
          未達成
        </span>
      </div>
    </section>
  );
}
