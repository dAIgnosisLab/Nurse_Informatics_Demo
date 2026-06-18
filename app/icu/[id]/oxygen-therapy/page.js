import prisma from '@/lib/prisma'
import OxygenClient from './OxygenClient'

async function getData(id) {
  try { return await prisma.oxygenTherapy.findUnique({ where: { patientId: id } }) }
  catch { return null }
}

export default async function OxygenPage({ params }) {
  const { id } = await params
  const data = await getData(id)
  return <OxygenClient patientId={id} existing={data} />
}
