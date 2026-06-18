import Link from 'next/link'
import prisma from '@/lib/prisma'
import PatientCard from '@/components/PatientCard'

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
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Emergency Room</h1>
          <div className="flex gap-3 mt-1 text-sm">
            {redCount > 0 && <span className="text-red-600 font-medium">● {redCount} Red</span>}
            {yellowCount > 0 && <span className="text-yellow-600 font-medium">● {yellowCount} Yellow</span>}
            {greenCount > 0 && <span className="text-green-600 font-medium">● {greenCount} Green</span>}
            {sorted.length === 0 && <span className="text-gray-400">No active patients</span>}
          </div>
        </div>
        <Link
          href="/er/new"
          className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
        >
          + New Patient
        </Link>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🏥</p>
          <p className="text-lg font-medium">No patients in ER</p>
          <p className="text-sm mt-1">Click &quot;+ New Patient&quot; to register a patient</p>
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
