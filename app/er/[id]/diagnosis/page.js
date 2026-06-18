import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function DiagnosisPage({ params }) {
  const { id } = await params
  const patient = await prisma.patient.findUnique({
    where: { id },
    include: { provisionalDx: true },
  })
  if (!patient) notFound()

  const dx = patient.provisionalDx

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
          <h1 className="mt-1 text-2xl font-bold text-slate-950">Provisional Diagnosis</h1>
        </div>

        <div className="px-5 py-5 sm:px-6">
          {!dx ? (
            <p className="text-sm text-slate-400 italic">Not yet filled by the doctor.</p>
          ) : (
            <p className="text-sm text-slate-800 whitespace-pre-wrap">{dx.diagnosisText}</p>
          )}
        </div>
      </div>
    </div>
  )
}
