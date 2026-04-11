"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/",          label: "プレイ",         icon: "🎰" },
  { href: "/dashboard", label: "ダッシュボード",  icon: "📊" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-pb">
      <ul className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex flex-col items-center justify-center gap-0.5 h-16 text-xs font-medium transition-colors relative ${
                  active ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {active && (
                  <span className="absolute top-0 left-4 right-4 h-0.5 bg-blue-500 rounded-full" />
                )}
                <span className="text-2xl">{icon}</span>
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
