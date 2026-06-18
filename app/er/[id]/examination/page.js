import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const systems = [
  { key: 'airway', label: 'Airway' },
  { key: 'breathing', label: 'Breathing' },
  { key: 'circulation', label: 'Circulation' },
  { key: 'pupils', label: 'Pupils' },
  { key: 'abdomen', label: 'Abdomen' },
]

export default async function ExaminationPage({ params }) {
  const { id } = await params
  const patient = await prisma.patient.findUnique({
    where: { id },
    include: { examination: true },
  })
  if (!patient) notFound()

  const exam = patient.examination

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Link
        href={`/er/${id}`}
        className="mb-4 inline-flex min-h-11 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
      >
        ← Back to Patient Summary
      </Link>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-5 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Doctor's Record</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-950">Physical Examination</h1>
        </div>

        <div className="px-5 py-5 sm:px-6">
          {!exam ? (
            <p className="text-sm text-slate-400 italic">Not yet filled by the doctor.</p>
          ) : (
            <div className="space-y-3">
              {systems.map((s) => {
                const status = exam[`${s.key}Status`]
                const notes = exam[`${s.key}Notes`]
                return (
                  <div key={s.key} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">{s.label}</span>
                      <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                        status === 'Normal'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {status}
                      </span>
                    </div>
                    {notes && <p className="mt-2 text-sm text-gray-600">{notes}</p>}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
