"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface LoginModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

type Mode = "login" | "signup";

export function LoginModal({ onClose, onSuccess }: LoginModalProps) {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signupDone, setSignupDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError("メールアドレスまたはパスワードが正しくありません");
      } else {
        onSuccess();
        onClose();
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError("登録に失敗しました。別のメールアドレスをお試しください");
      } else {
        setSignupDone(true);
      }
    }

    setLoading(false);
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onClick={onClose}
    >
      {/* Modal card */}
      <div
        className="w-full max-w-sm rounded-t-3xl sm:rounded-2xl bg-white px-6 py-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle (mobile) */}
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-gray-200 sm:hidden" />

        {signupDone ? (
          /* ── 登録完了メッセージ ── */
          <div className="text-center py-4 flex flex-col gap-4">
            <p className="text-2xl">📬</p>
            <p className="font-bold text-gray-800">確認メールを送信しました</p>
            <p className="text-sm text-gray-500">
              メールのリンクをクリックしてアカウントを有効化してください
            </p>
            <button
              onClick={onClose}
              className="mt-2 w-full py-3 rounded-xl bg-gray-100 text-gray-600 text-sm font-semibold"
            >
              閉じる
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="text-base font-bold text-gray-800">
                  {mode === "login" ? "ログイン" : "新規登録"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {mode === "login"
                    ? "ログインすると記録を保存できます"
                    : "アカウントを作成して記録を始めよう"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-300 hover:text-gray-500 text-xl leading-none"
                aria-label="閉じる"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="メールアドレス"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
              />
              <input
                type="password"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
              />

              {error && (
                <p className="text-xs text-red-500 px-1">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full py-3 rounded-xl font-bold text-sm text-white transition-all active:scale-[0.98] disabled:opacity-60"
                style={{
                  background: "linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)",
                  boxShadow: "0 3px 0 #1d4ed8",
                }}
              >
                {loading
                  ? "処理中..."
                  : mode === "login"
                    ? "ログイン"
                    : "登録する"}
              </button>
            </form>

            {/* Mode switch */}
            <p className="mt-4 text-center text-xs text-gray-400">
              {mode === "login" ? (
                <>
                  アカウントをお持ちでない方は{" "}
                  <button
                    onClick={() => { setMode("signup"); setError(null); }}
                    className="text-blue-500 font-semibold underline-offset-2 hover:underline"
                  >
                    新規登録
                  </button>
                </>
              ) : (
                <>
                  すでにアカウントをお持ちの方は{" "}
                  <button
                    onClick={() => { setMode("login"); setError(null); }}
                    className="text-blue-500 font-semibold underline-offset-2 hover:underline"
                  >
                    ログイン
                  </button>
                </>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
