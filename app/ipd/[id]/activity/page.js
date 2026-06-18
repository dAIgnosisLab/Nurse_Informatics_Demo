import prisma from '@/lib/prisma'
import ActivityClient from './ActivityClient'

async function getData(id) {
  try { return await prisma.activityLog.findMany({ where: { patientId: id }, orderBy: { recordedAt: 'desc' } }) }
  catch { return [] }
}

export default async function ActivityPage({ params }) {
  const { id } = await params
  const rows = await getData(id)
  return <ActivityClient patientId={id} initialRows={rows} />
}
