import prisma from '@/lib/prisma'
import ECGClient from './ECGClient'

async function getData(id) {
  try { return await prisma.ecgMonitoring.findUnique({ where: { patientId: id } }) }
  catch { return null }
}

export default async function ECGPage({ params }) {
  const { id } = await params
  const data = await getData(id)
  return <ECGClient patientId={id} existing={data} />
}
