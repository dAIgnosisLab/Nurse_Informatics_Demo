import Link from 'next/link'
import prisma from '@/lib/prisma'
import PatientCard from '@/components/PatientCard'

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
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">In-Patient Department</h1>
          <p className="text-gray-500 text-sm mt-0.5">{patients.length} active patient{patients.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/ipd/new" className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
          + Admit Patient
        </Link>
      </div>

      {patients.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🏥</p>
          <p className="text-lg font-medium">No patients in IPD</p>
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
