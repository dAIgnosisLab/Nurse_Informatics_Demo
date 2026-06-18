import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const statusColors = {
  Ordered: 'bg-gray-100 text-gray-600',
  Pending: 'bg-yellow-100 text-yellow-700',
  Completed: 'bg-green-100 text-green-700',
}

export default async function InvestigationsPage({ params }) {
  const { id } = await params
  const patient = await prisma.patient.findUnique({
    where: { id },
    include: { investigations: { orderBy: { createdAt: 'asc' } } },
  })
  if (!patient) notFound()

  const investigations = patient.investigations

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
          <h1 className="mt-1 text-2xl font-bold text-slate-950">Investigations</h1>
        </div>

        <div className="px-5 py-5 sm:px-6">
          {investigations.length === 0 ? (
            <p className="text-sm text-slate-400 italic">No investigations ordered yet.</p>
          ) : (
            <div className="space-y-3">
              {investigations.map((inv) => (
                <div key={inv.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800">{inv.type}</span>
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${statusColors[inv.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {inv.status}
                    </span>
                  </div>
                  {inv.notes && <p className="mt-1.5 text-sm text-gray-500">{inv.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
