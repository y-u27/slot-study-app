"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { HelpModal } from "@/components/HelpModal";

const NAV_ITEMS = [
  { href: "/", label: "プレイ", icon: "🎰" },
  { href: "/logs", label: "ログ", icon: "📋" },
  { href: "/dashboard", label: "DB", icon: "📊" },
];

export default function Header() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
    router.push("/");
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-lg mx-auto h-11 px-3 flex items-center justify-between">
          {/* 左：ナビゲーション */}
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map(({ href, label, icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    active
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-sm">{icon}</span>
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* 右：ヘルプ・ログアウト */}
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
