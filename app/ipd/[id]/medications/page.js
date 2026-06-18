import prisma from '@/lib/prisma'
import MedLogClient from './MedLogClient'

async function getData(id) {
  try { return await prisma.medication.findMany({ where: { patientId: id }, orderBy: { createdAt: 'desc' } }) }
  catch { return [] }
}

export default async function MedPage({ params }) {
  const { id } = await params
  const rows = await getData(id)
  return <MedLogClient patientId={id} initialRows={rows} />
}
