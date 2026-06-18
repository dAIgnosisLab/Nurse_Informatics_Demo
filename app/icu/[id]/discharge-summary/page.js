import prisma from '@/lib/prisma'
import DischargeSummaryClient from '@/app/ipd/[id]/discharge-summary/DischargeSummaryClient'

export const dynamic = 'force-dynamic'

async function getData(id) {
  try { return await prisma.dischargeSummary.findUnique({ where: { patientId: id } }) }
  catch { return null }
}

export default async function ICUDischargePage({ params }) {
  const { id } = await params
  const data = await getData(id)
  return <DischargeSummaryClient patientId={id} existing={data} />
}
