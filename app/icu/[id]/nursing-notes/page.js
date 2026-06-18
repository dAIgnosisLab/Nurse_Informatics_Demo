import prisma from '@/lib/prisma'
import NursingNotesClient from '@/app/ipd/[id]/nursing-notes/NursingNotesClient'

export const dynamic = 'force-dynamic'

async function getData(id) {
  try { return await prisma.nursingNote.findMany({ where: { patientId: id }, orderBy: { recordedAt: 'desc' } }) }
  catch { return [] }
}

export default async function ICUNursingNotesPage({ params }) {
  const { id } = await params
  const rows = await getData(id)
  return <NursingNotesClient patientId={id} initialRows={rows} />
}
