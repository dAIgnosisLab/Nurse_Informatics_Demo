import prisma from '@/lib/prisma'
import { treatmentCardexSchema } from '@/lib/validation/clinical'

export async function GET(request, { params }) {
  const { id } = await params
  const data = await prisma.treatmentCardex.findMany({ where: { patientId: id }, orderBy: { date: 'desc' } })
  return Response.json(data)
}

export async function POST(request, { params }) {
  const { id } = await params
  const body = await request.json()
  const result = treatmentCardexSchema.safeParse(body)
  if (!result.success) return Response.json({ error: result.error.flatten() }, { status: 400 })

  const { date, ...rest } = result.data
  const data = await prisma.treatmentCardex.create({
    data: { patientId: id, ...rest, ...(date && { date: new Date(date) }) },
  })
  return Response.json(data, { status: 201 })
}
