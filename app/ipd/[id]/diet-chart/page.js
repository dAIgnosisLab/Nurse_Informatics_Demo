import prisma from '@/lib/prisma'
import DietChartClient from './DietChartClient'

async function getData(id) {
  try { return await prisma.dietChart.findUnique({ where: { patientId: id } }) }
  catch { return null }
}

export default async function DietChartPage({ params }) {
  const { id } = await params
  const data = await getData(id)
  return <DietChartClient patientId={id} existing={data} />
}
