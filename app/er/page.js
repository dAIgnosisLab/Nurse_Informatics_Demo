import Link from 'next/link'
import prisma from '@/lib/prisma'
import PatientCard from '@/components/PatientCard'

export const dynamic = 'force-dynamic'

const triageOrder = { Red: 0, Yellow: 1, Green: 2, null: 3 }

async function getERPatients() {
  try {
    return await prisma.patient.findMany({
      where: { department: 'ER', status: { notIn: ['Transferred', 'Discharged'] } },
      include: {
        triage: true,
        erVitals: true,
        vitalSigns: { orderBy: { recordedAt: 'desc' }, take: 1 },
      },
      orderBy: { createdAt: 'asc' },
    })
  } catch {
    return []
  }
}

export default async function ERDashboard() {
  const patients = await getERPatients()

  const sorted = [...patients].sort((a, b) => {
    const ta = triageOrder[a.triage?.triageCode] ?? 3
    const tb = triageOrder[b.triage?.triageCode] ?? 3
    if (ta !== tb) return ta - tb
    return new Date(a.createdAt) - new Date(b.createdAt)
  })

  const redCount = sorted.filter((p) => p.triage?.triageCode === 'Red').length
  const yellowCount = sorted.filter((p) => p.triage?.triageCode === 'Yellow').length
  const greenCount = sorted.filter((p) => p.triage?.triageCode === 'Green').length

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">

      {/* Page header */}
      <div className="mb-5 overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 flex-wrap px-5 py-4 sm:px-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
              <p className="text-xs font-bold uppercase tracking-widest text-red-600">Emergency Room</p>
            </div>
            <h1 className="mt-0.5 text-2xl font-bold text-slate-900">Active Patients</h1>
            <div className="mt-1.5 flex flex-wrap gap-3 text-sm">
              {redCount > 0 && <span className="font-semibold text-red-600">● {redCount} Immediate</span>}
              {yellowCount > 0 && <span className="font-semibold text-yellow-600">● {yellowCount} Urgent</span>}
              {greenCount > 0 && <span className="font-semibold text-green-600">● {greenCount} Non-urgent</span>}
              {sorted.length === 0 && <span className="text-slate-400">No active patients</span>}
            </div>
          </div>
          <Link
            href="/er/new"
            className="inline-flex min-h-11 items-center rounded-xl bg-red-600 px-5 text-sm font-bold text-white transition hover:bg-red-700"
          >
            + New Patient
          </Link>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-2xl border border-sky-100 bg-white py-16 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl font-black text-red-300">
            ER
          </div>
          <p className="text-base font-semibold text-slate-600">No patients in the Emergency Room</p>
          <p className="mt-1 text-sm text-slate-400">Click &quot;+ New Patient&quot; to register a patient</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((p) => (
            <PatientCard key={p.id} patient={p} href={`/er/${p.id}`} />
          ))}
        </div>
      )}
    </div>
  )
}
