"use client";

import { useState } from "react";
import type { StudyLogRow } from "@/lib/types";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

interface DotStatus {
  total: number;
  achieved: number;
}

function buildDotMap(logs: StudyLogRow[]): Map<string, DotStatus> {
  const map = new Map<string, DotStatus>();
  for (const log of logs) {
    if (!log.created_at) continue;
    const date = log.created_at.split("T")[0];
    const prev = map.get(date) ?? { total: 0, achieved: 0 };
    map.set(date, {
      total: prev.total + 1,
      achieved: prev.achieved + (log.status ? 1 : 0),
    });
  }
  return map;
}

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

interface LogCalendarProps {
  logs: StudyLogRow[];
  selected: string | null; // "YYYY-MM-DD"
  onSelect: (date: string) => void;
}

export function LogCalendar({ logs, selected, onSelect }: LogCalendarProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-based

  const dotMap = buildDotMap(logs);
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDow = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun

  // Pad the front with nulls so day 1 lands on the correct column
  const cells: (number | null)[] = [
    ...Array<null>(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else setViewMonth((m) => m + 1);
  };

  const todayStr = toDateStr(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  return (
    <div className="flex flex-col h-full select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-2.5 border-b border-gray-100">
        <button
          onClick={prevMonth}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors text-sm"
        >
          ‹
        </button>
        <span className="text-xs font-bold text-gray-700">
          {viewYear}年{viewMonth + 1}月
        </span>
        <button
          onClick={nextMonth}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors text-sm"
        >
          ›
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 px-1 pt-2 pb-1">
        {WEEKDAYS.map((d, i) => (
          <div
            key={d}
            className={`text-center text-[9px] font-semibold pb-1 ${
              i === 0
                ? "text-red-400"
                : i === 6
                  ? "text-blue-400"
                  : "text-gray-400"
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-0.5 px-1 pb-2 flex-1">
        {cells.map((day, idx) => {
          if (day === null) return <div key={`empty-${idx}`} />;

          const dateStr = toDateStr(viewYear, viewMonth, day);
          const dot = dotMap.get(dateStr);
          const isToday = dateStr === todayStr;
          const isSel = dateStr === selected;
          const dow = (firstDow + day - 1) % 7;

          // Dot color based on achievement
          const dotColor = !dot
            ? null
            : dot.achieved === dot.total
              ? "bg-green-400"
              : dot.achieved > 0
                ? "bg-amber-400"
                : "bg-gray-300";

          return (
            <button
              key={dateStr}
              onClick={() => onSelect(isSel ? "" : dateStr)}
              className={`flex flex-col items-center justify-center py-0.5 rounded-lg transition-colors ${
                isSel
                  ? "bg-blue-500"
                  : isToday
                    ? "bg-blue-50"
                    : "hover:bg-gray-100"
              }`}
            >
              <span
                className={`text-[11px] font-medium leading-none ${
                  isSel
                    ? "text-white"
                    : isToday
                      ? "text-blue-600 font-bold"
                      : dow === 0
                        ? "text-red-400"
                        : dow === 6
                          ? "text-blue-400"
                          : "text-gray-700"
                }`}
              >
                {day}
              </span>
              {/* Log indicator dot */}
              <span className="h-1.5 mt-0.5 flex items-center justify-center">
                {dotColor && (
                  <span
                    className={`w-1 h-1 rounded-full ${dotColor} ${isSel ? "opacity-80" : ""}`}
                  />
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="border-t border-gray-100 px-2 py-2 flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-[9px] text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
          全達成
        </div>
        <div className="flex items-center gap-1.5 text-[9px] text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
          一部達成
        </div>
        <div className="flex items-center gap-1.5 text-[9px] text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300 inline-block" />
          未達成
        </div>
      </div>
    </div>
  );
}
