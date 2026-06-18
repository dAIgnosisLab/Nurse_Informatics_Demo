import Link from 'next/link'
import prisma from '@/lib/prisma'

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
    action: 'New patient, triage, first vitals',
    href: '/er',
    newHref: '/er/new',
    color: 'border-red-200 hover:border-red-300 hover:bg-red-50',
    badge: 'bg-red-600 text-white',
    button: 'bg-red-600 hover:bg-red-700 text-white',
    soft: 'bg-red-50 text-red-700 border-red-100',
  },
  {
    key: 'ipd',
    name: 'Ward Care',
    shortName: 'IPD',
    action: 'Admitted patients, medicines, nursing notes',
    href: '/ipd',
    newHref: '/ipd/new',
    color: 'border-blue-200 hover:border-blue-300 hover:bg-blue-50',
    badge: 'bg-blue-600 text-white',
    button: 'bg-blue-600 hover:bg-blue-700 text-white',
    soft: 'bg-blue-50 text-blue-700 border-blue-100',
  },
  {
    key: 'icu',
    name: 'Critical Care',
    shortName: 'ICU',
    action: 'ICU monitoring, oxygen, ventilator support',
    href: '/icu',
    newHref: '/icu/new',
    color: 'border-violet-200 hover:border-violet-300 hover:bg-violet-50',
    badge: 'bg-violet-600 text-white',
    button: 'bg-violet-600 hover:bg-violet-700 text-white',
    soft: 'bg-violet-50 text-violet-700 border-violet-100',
  },
]

export default async function HomePage() {
  const stats = await getStats()
  const totalActive = stats.er + stats.ipd + stats.icu

  return (
    <div className="min-h-full bg-slate-50">
      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Nurse Informatics</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Choose your care area
              </h1>
              <p className="mt-3 max-w-2xl text-base text-slate-600">
                Simple patient worklists for emergency, ward, and critical care teams.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-sm font-medium text-slate-500">Active patients</p>
              <p className="text-3xl font-bold text-slate-950">{totalActive}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {departments.map((department) => (
            <DepartmentCard
              key={department.key}
              department={department}
              activeCount={stats[department.key]}
            />
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Quick view</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {departments.map((department) => (
              <Link
                key={department.key}
                href={department.href}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 transition ${department.soft}`}
              >
                <span className="text-sm font-semibold">{department.shortName}</span>
                <span className="text-sm">{stats[department.key]} active</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function DepartmentCard({ department, activeCount }) {
  return (
    <div className={`rounded-2xl border-2 bg-white p-5 shadow-sm transition ${department.color}`}>
      <Link href={department.href} className="block">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl text-lg font-black ${department.badge}`}>
              {department.shortName}
            </div>
            <h2 className="mt-4 text-2xl font-bold text-slate-950">{department.name}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{department.action}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-right">
            <p className="text-2xl font-bold text-slate-950">{activeCount}</p>
            <p className="text-xs font-medium text-slate-500">active</p>
          </div>
        </div>
      </Link>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Link
          href={department.href}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          Open list
        </Link>
        <Link
          href={department.newHref}
          className={`rounded-xl px-4 py-3 text-center text-sm font-semibold transition ${department.button}`}
        >
          New patient
        </Link>
      </div>
    </div>
  )
}
