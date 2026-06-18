import prisma from '@/lib/prisma'
import VentilatorClient from './VentilatorClient'

async function getData(id) {
  try { return await prisma.ventilatorSupport.findUnique({ where: { patientId: id } }) }
  catch { return null }
}

export default async function VentilatorPage({ params }) {
  const { id } = await params
  const data = await getData(id)
  return <VentilatorClient patientId={id} existing={data} />
}
