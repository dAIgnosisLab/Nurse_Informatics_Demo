'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'

function MedicalCross() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7z" />
    </svg>
  )
}

const depts = [
  { label: 'ER', fullLabel: 'Emergency', href: '/er', active: 'bg-red-600 text-white shadow-sm', hover: 'hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950 dark:hover:text-red-400' },
  { label: 'Ward', fullLabel: 'Ward Care', href: '/ipd', active: 'bg-blue-600 text-white shadow-sm', hover: 'hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950 dark:hover:text-blue-400' },
  { label: 'ICU', fullLabel: 'Critical Care', href: '/icu', active: 'bg-violet-600 text-white shadow-sm', hover: 'hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-violet-950 dark:hover:text-violet-400' },
]

export default function TopNav() {
  const path = usePathname()

  return (
    <nav className="sticky top-0 z-50 border-b border-sky-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className={`inline-flex min-h-11 items-center gap-2.5 rounded-xl px-3 text-base font-bold transition ${
            path === '/'
              ? 'bg-cyan-700 text-white'
              : 'text-cyan-800 hover:bg-cyan-50 dark:text-cyan-400 dark:hover:bg-cyan-950'
          }`}
          aria-current={path === '/' ? 'page' : undefined}
        >
          <MedicalCross />
          Nurse Informatics
        </Link>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {depts.map((d) => {
            const active = path.startsWith(d.href)
            return (
              <Link
                key={d.label}
                href={d.href}
                className={`inline-flex min-h-11 shrink-0 items-center rounded-xl px-4 text-sm font-semibold transition ${
                  active
                    ? d.active
                    : `bg-sky-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300 ${d.hover}`
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <span className="sm:hidden">{d.label}</span>
                <span className="hidden sm:inline">{d.fullLabel}</span>
              </Link>
            )
          })}

          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
