import prisma from '@/lib/prisma'
import BTClient from './BTClient'

async function getData(id) {
  try { return await prisma.bloodTransfusion.findMany({ where: { patientId: id }, orderBy: { createdAt: 'desc' } }) }
  catch { return [] }
}

export default async function BTPage({ params }) {
  const { id } = await params
  const rows = await getData(id)
  return <BTClient patientId={id} initialRows={rows} />
}
