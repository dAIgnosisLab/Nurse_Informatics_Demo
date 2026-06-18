import prisma from '@/lib/prisma'
import IVFluidsClient from '@/app/ipd/[id]/iv-fluids/IVFluidsClient'

export const dynamic = 'force-dynamic'

async function getData(id) {
  try { return await prisma.ivFluid.findMany({ where: { patientId: id }, orderBy: { createdAt: 'desc' } }) }
  catch { return [] }
}

export default async function ICUIVFluidsPage({ params }) {
  const { id } = await params
  const rows = await getData(id)
  return <IVFluidsClient patientId={id} initialRows={rows} />
}
