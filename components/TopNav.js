'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const depts = [
  { label: 'ER', fullLabel: 'Emergency', href: '/er', active: 'bg-red-600 text-white', hover: 'hover:bg-red-50 hover:text-red-700' },
  { label: 'Ward', fullLabel: 'Ward Care', href: '/ipd', active: 'bg-blue-600 text-white', hover: 'hover:bg-blue-50 hover:text-blue-700' },
  { label: 'ICU', fullLabel: 'Critical Care', href: '/icu', active: 'bg-violet-600 text-white', hover: 'hover:bg-violet-50 hover:text-violet-700' },
]

export default function TopNav() {
  const path = usePathname()

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className={`inline-flex min-h-11 items-center rounded-xl px-3 text-base font-bold transition ${
            path === '/' ? 'bg-slate-900 text-white' : 'text-slate-900 hover:bg-slate-100'
          }`}
          aria-current={path === '/' ? 'page' : undefined}
        >
          Nurse Informatics
        </Link>

        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          {depts.map((d) => {
            const active = path.startsWith(d.href)
            return (
              <Link
                key={d.label}
                href={d.href}
                className={`inline-flex min-h-11 shrink-0 items-center rounded-xl px-4 text-sm font-semibold transition ${
                  active ? d.active : `bg-slate-50 text-slate-700 ${d.hover}`
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <span className="sm:hidden">{d.label}</span>
                <span className="hidden sm:inline">{d.fullLabel}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
