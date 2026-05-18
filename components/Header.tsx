"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { HelpModal } from "@/components/HelpModal";

export default function Header() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
    router.push("/");
  };

  const emailLabel = user?.email
    ? user.email.length > 20
      ? user.email.slice(0, 18) + "…"
      : user.email
    : "ログイン中";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-lg mx-auto h-11 px-4 flex items-center justify-between">
          {user ? (
            <span className="text-xs text-gray-400 truncate max-w-[55%]">
              {emailLabel}
            </span>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowHelp(true)}
              className="w-7 h-7 rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 text-sm font-bold flex items-center justify-center"
              aria-label="使い方ガイドを開く"
            >
              ?
            </button>
            {user && (
              <button
                onClick={handleLogout}
                disabled={loading}
                className="text-xs text-gray-400 hover:text-red-400 transition-colors disabled:opacity-40 flex items-center gap-1"
              >
                <span>↩</span>
                <span>{loading ? "…" : "ログアウト"}</span>
              </button>
            )}
          </div>
        </div>
      </header>
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </>
  );
}
