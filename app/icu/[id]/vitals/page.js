import { Suspense } from 'react'
import prisma from '@/lib/prisma'
import VitalsLogClient from '@/app/ipd/[id]/vitals/VitalsLogClient'

export const dynamic = 'force-dynamic'

async function getData(id) {
  try { return await prisma.vitalSign.findMany({ where: { patientId: id }, orderBy: { recordedAt: 'desc' } }) }
  catch { return [] }
}

export default async function ICUVitalsPage({ params }) {
  const { id } = await params
  const rows = await getData(id)
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-400">Loading…</div>}>
      <VitalsLogClient patientId={id} initialRows={rows} />
    </Suspense>
  )
}
