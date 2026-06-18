import prisma from '@/lib/prisma'
import CardexClient from '@/app/ipd/[id]/treatment-cardex/CardexClient'

export const dynamic = 'force-dynamic'

async function getData(id) {
  try { return await prisma.treatmentCardex.findMany({ where: { patientId: id }, orderBy: { date: 'desc' } }) }
  catch { return [] }
}

export default async function ICUCardexPage({ params }) {
  const { id } = await params
  const rows = await getData(id)
  return <CardexClient patientId={id} initialRows={rows} />
}
