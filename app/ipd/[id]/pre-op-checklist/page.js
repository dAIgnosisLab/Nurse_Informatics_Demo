import prisma from '@/lib/prisma'
import PreOpClient from './PreOpClient'

async function getData(id) {
  try { return await prisma.preOpChecklist.findUnique({ where: { patientId: id } }) }
  catch { return null }
}

export default async function PreOpPage({ params }) {
  const { id } = await params
  const data = await getData(id)
  return <PreOpClient patientId={id} existing={data} />
}
