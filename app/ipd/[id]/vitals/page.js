import { Suspense } from 'react'
import prisma from '@/lib/prisma'
import VitalsLogClient from './VitalsLogClient'

async function getData(id) {
  try {
    const rows = await prisma.vitalSign.findMany({ where: { patientId: id }, orderBy: { recordedAt: 'desc' } })
    return rows
  } catch { return [] }
}

export default async function VitalsPage({ params }) {
  const { id } = await params
  const rows = await getData(id)
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-400">Loading…</div>}>
      <VitalsLogClient patientId={id} initialRows={rows} />
    </Suspense>
  )
}
