import Link from 'next/link'
import prisma from '@/lib/prisma'
import PatientCard from '@/components/PatientCard'

export const dynamic = 'force-dynamic'

async function getICUPatients() {
  try {
    return await prisma.patient.findMany({
      where: { department: 'ICU', status: { notIn: ['Transferred', 'Discharged'] } },
      include: {
        vitalSigns: { orderBy: { recordedAt: 'desc' }, take: 1 },
        ventilatorSupport: true,
        criticalObs: { orderBy: { recordedAt: 'desc' }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    })
  } catch { return [] }
}

export default async function ICUDashboard() {
  const patients = await getICUPatients()
  const onVentilator = patients.filter((p) => p.ventilatorSupport?.inUse).length

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">

      {/* Page header */}
      <div className="mb-5 overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 flex-wrap px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-violet-600">Critical Care</p>
            <h1 className="mt-0.5 text-2xl font-bold text-slate-900">Intensive Care Unit</h1>
            <div className="mt-1 flex flex-wrap gap-3 text-sm">
              <span className="text-slate-500">{patients.length} patient{patients.length !== 1 ? 's' : ''}</span>
              {onVentilator > 0 && (
                <span className="font-semibold text-red-600">● {onVentilator} on ventilator</span>
              )}
            </div>
          </div>
          <Link
            href="/icu/new"
            className="inline-flex min-h-11 items-center rounded-xl bg-violet-600 px-5 text-sm font-bold text-white transition hover:bg-violet-700"
          >
            + Admit to ICU
          </Link>
        </div>
      </div>

      {patients.length === 0 ? (
        <div className="rounded-2xl border border-sky-100 bg-white py-16 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-violet-50 text-sm font-black text-violet-300">
            ICU
          </div>
          <p className="text-base font-semibold text-slate-600">No patients in the ICU</p>
          <p className="mt-1 text-sm text-slate-400">Click &quot;+ Admit to ICU&quot; to register a patient</p>
        </div>
      ) : (
        <div className="space-y-3">
          {patients.map((p) => (
            <PatientCard key={p.id} patient={p} href={`/icu/${p.id}`} />
          ))}
        </div>
      )}
    </div>
  )
}
