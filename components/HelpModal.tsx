"use client";

import { useEffect } from "react";

interface HelpModalProps {
  onClose: () => void;
}

export function HelpModal({ onClose }: HelpModalProps) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      style={{ background: "rgba(0,0,0,0.6)", height: "100dvh" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="overflow-y-auto overscroll-contain px-6 py-6"
          style={{
            maxHeight: "90dvh",
            paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
          }}
        >
          {/* ヘッダー */}
          <div className="mb-5 flex items-start justify-between">
            <div>
              <p className="text-base font-bold text-gray-800">使い方ガイド</p>
              <p className="text-xs text-gray-400 mt-0.5">
                slot-study の概要と操作方法
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-gray-500 text-xl leading-none p-1 -mr-1"
              aria-label="閉じる"
            >
              ✕
            </button>
          </div>

          {/* アプリ概要 */}
          <section className="mb-6">
            <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <span className="text-base">🎰</span>
              アプリ概要
            </h2>
            <ul className="flex flex-col gap-2">
              {[
                {
                  icon: "🎯",
                  text: "スロットで今日の学習内容をランダム決定",
                },
                {
                  icon: "⏱️",
                  text: "学習時間も一緒にスロットで決めて迷いをゼロに",
                },
                {
                  icon: "📝",
                  text: "学習ログを記録して振り返りに活用",
                },
                {
                  icon: "📊",
                  text: "ダッシュボードで達成率・グラフを可視化",
                },
              ].map(({ icon, text }) => (
                <li
                  key={text}
                  className="flex items-start gap-3 text-sm text-gray-600"
                >
                  <span className="text-base shrink-0 mt-0.5">{icon}</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="border-t border-gray-100 mb-6" />

          {/* 操作説明 */}
          <section className="mb-2">
            <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <span className="text-base">📖</span>
              操作説明
            </h2>
            <ol className="flex flex-col gap-4">
              {[
                {
                  step: 1,
                  label: "スロットを回す",
                  desc: "プレイ画面の START ボタンを押してスロットを開始",
                },
                {
                  step: 2,
                  label: "内容と時間を確定",
                  desc: "STOP ボタンで学習テーマと時間が決まる",
                },
                {
                  step: 3,
                  label: "学習ログを保存",
                  desc: "「記録する」ボタンでログを保存（要ログイン）",
                },
                {
                  step: 4,
                  label: "達成率を確認",
                  desc: "ダッシュボードでグラフ・統計をチェック",
                },
              ].map(({ step, label, desc }) => (
                <li key={step} className="flex items-start gap-3">
                  <span
                    className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5"
                    style={{
                      background:
                        "linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)",
                    }}
                  >
                    {step}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      {label}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* 閉じるボタン */}
          <button
            onClick={onClose}
            className="mt-6 w-full py-3 rounded-xl bg-gray-100 text-gray-600 text-sm font-semibold hover:bg-gray-200 transition-colors active:scale-[0.98]"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
