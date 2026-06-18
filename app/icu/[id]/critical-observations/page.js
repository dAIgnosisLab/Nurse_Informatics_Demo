import prisma from '@/lib/prisma'
import CritObsClient from './CritObsClient'

async function getData(id) {
  try { return await prisma.criticalObservation.findMany({ where: { patientId: id }, orderBy: { recordedAt: 'desc' } }) }
  catch { return [] }
}

export default async function CritObsPage({ params }) {
  const { id } = await params
  const rows = await getData(id)
  return <CritObsClient patientId={id} initialRows={rows} />
}
