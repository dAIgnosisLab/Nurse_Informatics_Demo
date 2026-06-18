'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const depts = [
  { label: 'ER', href: '/er', color: 'bg-red-500' },
  { label: 'IPD', href: '/ipd', color: 'bg-blue-500' },
  { label: 'ICU', href: '/icu', color: 'bg-purple-600' },
]

export default function TopNav() {
  const path = usePathname()

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2 font-bold text-gray-800 text-lg">
          <span className="text-blue-600">+</span>
          <span>NurseInfo</span>
        </Link>

        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500 mr-2 hidden sm:block">Department:</span>
          {depts.map((d) => {
            const active = path.startsWith(d.href)
            return (
              <Link
                key={d.label}
                href={d.href}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  active
                    ? `${d.color} text-white`
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {d.label}
              </Link>
            )
          })}
        </div>

        <Link
          href="/"
          className={`text-sm font-medium px-3 py-1.5 rounded transition-colors ${
            path === '/' ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Dashboard
        </Link>
      </div>
    </nav>
  )
}
