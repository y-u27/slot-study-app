"use client";

import type { StudyLogRow } from "@/lib/types";

const MAX_BAR_H = 88; // px

interface DayStat {
  date: string;
  total: number;
  achieved: number;
}

// 複数の学習ログ(StudyLogRow[(])を受け取り、日付ごとに集計した配列(DayStat[])を返す関数
function buildDayStats(logs: StudyLogRow[]): DayStat[] {
  // 日付文字列をキー、集計データを値とするからのMapを左作成
  const map = new Map<string, DayStat>();
  // 以下ログを1件ずつ繰り返し処理する
  for (const log of logs) {
    // dateを定義し、logのcreated_atが正しい場合、created_atは"2025-05-17T12:34:56"の形式のため、split("T")[0]で日付部分("2025-05-17")だけ取り出す
    // 違う場合、"不明"を表示する
    const date = log.created_at ? log.created_at.split("T")[0] : "不明";
    // existingを定義し、その日付のデータがMapにすでにあれば取得、なければ初期値(total: 0, achieved: 0)を作成する
    const existing = map.get(date) ?? { date, total: 0, achieved: 0 };
    // 既存データ(existing)を展開した上で、totalに+1、達成ならachievedにも+1してMapを更新
    map.set(date, {
      ...existing,
      total: existing.total + 1,
      achieved: existing.achieved + (log.status ? 1 : 0),
    });
  }
  // 上記以外の場合、Array.fromメソッドで以下処理をする
  // 1.Array.fromメソッドでMapの値だけを取り出して配列に変換
  return Array.from(map.values())
    // 日付文字列を辞書順(日付の正受)に並び替え
    .sort((a, b) => a.date.localeCompare(b.date))
    // 配列の末尾14件だけを取り出す(最新14日分)
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
