import Link from 'next/link'
import prisma from '@/lib/prisma'

async function getStats() {
  try {
    const [er, ipd, icu] = await Promise.all([
      prisma.patient.count({ where: { department: 'ER', status: { notIn: ['Discharged'] } } }),
      prisma.patient.count({ where: { department: 'IPD', status: { notIn: ['Discharged'] } } }),
      prisma.patient.count({ where: { department: 'ICU', status: { notIn: ['Discharged'] } } }),
    ])
    return { er, ipd, icu }
  } catch {
    return { er: 0, ipd: 0, icu: 0 }
  }
}

const depts = [
  {
    key: 'er',
    label: 'Emergency Room',
    abbr: 'ER',
    desc: 'Triage, intake, initial assessment and stabilisation',
    href: '/er',
    color: 'border-red-400 hover:bg-red-50',
    badgeColor: 'bg-red-500',
    icon: '🚨',
  },
  {
    key: 'ipd',
    label: 'In-Patient Department',
    abbr: 'IPD',
    desc: 'Ongoing care, medication, nursing notes, discharge',
    href: '/ipd',
    color: 'border-blue-400 hover:bg-blue-50',
    badgeColor: 'bg-blue-500',
    icon: '🏥',
  },
  {
    key: 'icu',
    label: 'Intensive Care Unit',
    abbr: 'ICU',
    desc: 'Critical monitoring, ventilator support, critical observations',
    href: '/icu',
    color: 'border-purple-400 hover:bg-purple-50',
    badgeColor: 'bg-purple-600',
    icon: '💊',
  },
]

export default async function HomePage() {
  const stats = await getStats()

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Nurse Informatics System</h1>
        <p className="mt-2 text-gray-500 text-lg">Select a department to get started</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {depts.map((d) => (
          <Link key={d.key} href={d.href}>
            <div className={`relative bg-white border-2 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer ${d.color}`}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{d.icon}</span>
                <span className={`${d.badgeColor} text-white text-sm font-bold px-3 py-1 rounded-full`}>
                  {stats[d.key]} active
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">{d.abbr}</h2>
              <p className="text-sm text-gray-500 font-medium mb-1">{d.label}</p>
              <p className="text-sm text-gray-400">{d.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
