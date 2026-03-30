'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/', label: 'スロット', icon: '🎰' },
  { href: '/settings', label: '設定', icon: '⚙️' },
  { href: '/logs', label: 'ログ', icon: '📋' },
  { href: '/stats', label: '統計', icon: '📊' },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <ul className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const active = pathname === href
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex flex-col items-center gap-0.5 px-4 py-2 text-xs font-medium transition-colors ${
                  active ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="text-xl">{icon}</span>
                <span>{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
