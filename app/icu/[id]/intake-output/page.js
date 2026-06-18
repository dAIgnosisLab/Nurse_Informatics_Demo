import prisma from '@/lib/prisma'
import IOLogClient from '@/app/ipd/[id]/intake-output/IOLogClient'

export const dynamic = 'force-dynamic'

async function getData(id) {
  try { return await prisma.intakeOutput.findMany({ where: { patientId: id }, orderBy: { recordedAt: 'desc' } }) }
  catch { return [] }
}

export default async function ICUIOPage({ params }) {
  const { id } = await params
  const rows = await getData(id)
  return <IOLogClient patientId={id} initialRows={rows} />
}
