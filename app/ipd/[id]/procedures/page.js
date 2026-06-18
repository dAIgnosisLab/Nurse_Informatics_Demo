import prisma from '@/lib/prisma'
import ProceduresClient from './ProceduresClient'

async function getData(id) {
  try { return await prisma.procedureRecord.findMany({ where: { patientId: id }, orderBy: { dateTime: 'desc' } }) }
  catch { return [] }
}

export default async function ProceduresPage({ params }) {
  const { id } = await params
  const rows = await getData(id)
  return <ProceduresClient patientId={id} initialRows={rows} />
}
