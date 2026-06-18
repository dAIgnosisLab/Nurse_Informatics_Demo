import Link from 'next/link'
import prisma from '@/lib/prisma'
import PatientCard from '@/components/PatientCard'

export const dynamic = 'force-dynamic'

async function getIPDPatients() {
  try {
    return await prisma.patient.findMany({
      where: { department: 'IPD', status: { notIn: ['Transferred', 'Discharged'] } },
      include: {
        triage: true,
        vitalSigns: { orderBy: { recordedAt: 'desc' }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    })
  } catch { return [] }
}

export default async function IPDDashboard() {
  const patients = await getIPDPatients()

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">

      {/* Page header */}
      <div className="mb-5 overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 flex-wrap px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Ward Care</p>
            <h1 className="mt-0.5 text-2xl font-bold text-slate-900">In-Patient Department</h1>
            <p className="mt-1 text-sm text-slate-500">
              {patients.length} active patient{patients.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link
            href="/ipd/new"
            className="inline-flex min-h-11 items-center rounded-xl bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            + Admit Patient
          </Link>
        </div>
      </div>

      {patients.length === 0 ? (
        <div className="rounded-2xl border border-sky-100 bg-white py-16 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-sm font-black text-blue-300">
            IPD
          </div>
          <p className="text-base font-semibold text-slate-600">No patients in the Ward</p>
          <p className="mt-1 text-sm text-slate-400">Click &quot;+ Admit Patient&quot; to register a patient</p>
        </div>
      ) : (
        <div className="space-y-3">
          {patients.map((p) => (
            <PatientCard key={p.id} patient={p} href={`/ipd/${p.id}`} />
          ))}
        </div>
      )}
    </div>
  )
}
