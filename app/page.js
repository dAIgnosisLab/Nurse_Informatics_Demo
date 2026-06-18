import Link from 'next/link'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getStats() {
  try {
    const [er, ipd, icu] = await Promise.all([
      prisma.patient.count({ where: { department: 'ER', status: { notIn: ['Transferred', 'Discharged'] } } }),
      prisma.patient.count({ where: { department: 'IPD', status: { notIn: ['Transferred', 'Discharged'] } } }),
      prisma.patient.count({ where: { department: 'ICU', status: { notIn: ['Transferred', 'Discharged'] } } }),
    ])
    return { er, ipd, icu }
  } catch {
    return { er: 0, ipd: 0, icu: 0 }
  }
}

const departments = [
  {
    key: 'er',
    name: 'Emergency Room',
    shortName: 'ER',
    description: 'Triage, initial assessment, first vitals and emergency intake',
    href: '/er',
    newHref: '/er/new',
    border: 'border-red-200 hover:border-red-300',
    badge: 'bg-red-600 text-white',
    stat: 'text-red-600',
    newBtn: 'bg-red-600 hover:bg-red-700 text-white',
    listBtn: 'text-red-700 hover:bg-red-50',
    divider: 'bg-red-100',
  },
  {
    key: 'ipd',
    name: 'Ward Care',
    shortName: 'IPD',
    description: 'Admitted patients, medications, nursing notes, I/O balance',
    href: '/ipd',
    newHref: '/ipd/new',
    border: 'border-blue-200 hover:border-blue-300',
    badge: 'bg-blue-600 text-white',
    stat: 'text-blue-600',
    newBtn: 'bg-blue-600 hover:bg-blue-700 text-white',
    listBtn: 'text-blue-700 hover:bg-blue-50',
    divider: 'bg-blue-100',
  },
  {
    key: 'icu',
    name: 'Critical Care',
    shortName: 'ICU',
    description: 'ICU monitoring, ventilator, oxygen therapy, critical observations',
    href: '/icu',
    newHref: '/icu/new',
    border: 'border-violet-200 hover:border-violet-300',
    badge: 'bg-violet-600 text-white',
    stat: 'text-violet-600',
    newBtn: 'bg-violet-600 hover:bg-violet-700 text-white',
    listBtn: 'text-violet-700 hover:bg-violet-50',
    divider: 'bg-violet-100',
  },
]

export default async function HomePage() {
  const stats = await getStats()
  const totalActive = stats.er + stats.ipd + stats.icu

  return (
    <div className="min-h-full">
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">

        {/* Hero Banner */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm">
          <div className="bg-linear-to-br from-cyan-700 to-cyan-600 px-6 py-8 sm:px-8">
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-200">Clinical Nursing Station</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Patient Care Dashboard
            </h1>
            <p className="mt-2 text-sm text-cyan-100">
              Real-time patient management for emergency, ward, and critical care nursing teams.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 border-t border-sky-100 px-6 py-4 sm:px-8">
            <Stat label="Total Active" value={totalActive} color="text-cyan-700" />
            <div className="w-px bg-sky-100" />
            <Stat label="Emergency" value={stats.er} color="text-red-600" />
            <Stat label="Ward" value={stats.ipd} color="text-blue-600" />
            <Stat label="ICU" value={stats.icu} color="text-violet-600" />
          </div>
        </div>

        {/* Department Cards */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {departments.map((dept) => (
            <div
              key={dept.key}
              className={`overflow-hidden rounded-2xl border-2 bg-white shadow-sm transition hover:shadow-md ${dept.border}`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl text-sm font-black ${dept.badge}`}>
                    {dept.shortName}
                  </div>
                  <div className="text-right">
                    <p className={`text-3xl font-black leading-none ${dept.stat}`}>{stats[dept.key]}</p>
                    <p className="mt-1 text-xs font-medium text-slate-400">active</p>
                  </div>
                </div>
                <h2 className="mt-4 text-xl font-bold text-slate-900">{dept.name}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{dept.description}</p>
              </div>

              <div className={`h-px ${dept.divider}`} />
              <div className="grid grid-cols-2">
                <Link
                  href={dept.href}
                  className={`py-3 text-center text-sm font-semibold transition ${dept.listBtn}`}
                >
                  Open List
                </Link>
                <div className={`w-px ${dept.divider}`} />
                <Link
                  href={dept.newHref}
                  className={`py-3 text-center text-sm font-semibold transition ${dept.newBtn}`}
                >
                  + New Patient
                </Link>
              </div>
            </div>
          ))}
        </div>

      </section>
    </div>
  )
}

function Stat({ label, value, color }) {
  return (
    <div>
      <p className={`text-2xl font-black leading-none ${color}`}>{value}</p>
      <p className="mt-1 text-xs font-medium text-slate-500">{label}</p>
    </div>
  )
}
