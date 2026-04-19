"use client";

import { useEffect, useState } from "react";
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

  // モーダル表示中は背景スクロールを禁止
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

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
    /* Backdrop — dvh でモバイル Safari のツールバーを除いた実際の高さを使う */
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      style={{
        background: "rgba(0,0,0,0.55)",
        // iOS Safari で inset-0 が 100vh を超えるケースの保険
        height: "100dvh",
      }}
      onClick={onClose}
    >
      {/* Modal card — max-h で画面内に収める */}
      <div
        className="w-full max-w-sm rounded-t-3xl sm:rounded-2xl bg-white shadow-2xl flex flex-col"
        style={{ maxHeight: "90dvh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ドラッグハンドル（固定・スクロール対象外） */}
        <div className="shrink-0 pt-3 pb-1 flex justify-center sm:hidden">
          <div className="h-1 w-10 rounded-full bg-gray-200" />
        </div>

        {/* スクロール可能なコンテンツ領域 */}
        <div
          className="overflow-y-auto flex-1 px-6 pt-4 pb-6"
          style={{
            // iPhone ホームインジケーターにかぶらないように
            paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
          }}
        >
          {signupDone ? (
            /* ── 登録完了メッセージ ── */
            <div className="text-center py-4 flex flex-col gap-4">
              <p className="text-3xl">📬</p>
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
              {/* ヘッダー */}
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
                  className="text-gray-300 hover:text-gray-500 text-xl leading-none p-1 -mr-1"
                  aria-label="閉じる"
                >
                  ✕
                </button>
              </div>

              {/* フォーム */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="メールアドレス"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  // font-size 16px でiOSの自動ズームを防ぐ
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                />
                <input
                  type="password"
                  placeholder="パスワード（6文字以上）"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                />

                {error && (
                  <p className="text-xs text-red-500 px-1">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  // min-h でタップ領域を確保
                  className="mt-1 w-full min-h-[48px] rounded-xl font-bold text-sm text-white transition-all active:scale-[0.98] disabled:opacity-60"
                  style={{
                    background:
                      "linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)",
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

              {/* モード切替 */}
              <p className="mt-5 text-center text-xs text-gray-400">
                {mode === "login" ? (
                  <>
                    アカウントをお持ちでない方は{" "}
                    <button
                      onClick={() => {
                        setMode("signup");
                        setError(null);
                      }}
                      className="text-blue-500 font-semibold underline-offset-2 hover:underline"
                    >
                      新規登録
                    </button>
                  </>
                ) : (
                  <>
                    すでにアカウントをお持ちの方は{" "}
                    <button
                      onClick={() => {
                        setMode("login");
                        setError(null);
                      }}
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
    </div>
  );
}
