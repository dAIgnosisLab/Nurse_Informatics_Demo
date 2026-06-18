import Link from 'next/link'
import prisma from '@/lib/prisma'
import PatientCard from '@/components/PatientCard'

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
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Intensive Care Unit</h1>
          <div className="flex gap-3 mt-1 text-sm text-gray-500">
            <span>{patients.length} patient{patients.length !== 1 ? 's' : ''}</span>
            {onVentilator > 0 && <span className="text-red-600 font-medium">● {onVentilator} on ventilator</span>}
          </div>
        </div>
        <Link href="/icu/new" className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-colors">
          + Admit to ICU
        </Link>
      </div>

      {patients.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">💊</p>
          <p className="text-lg font-medium">No patients in ICU</p>
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
