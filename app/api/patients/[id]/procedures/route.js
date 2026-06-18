import prisma from '@/lib/prisma'
import { procedureSchema } from '@/lib/validation/clinical'

export async function GET(request, { params }) {
  const { id } = await params
  const data = await prisma.procedureRecord.findMany({ where: { patientId: id }, orderBy: { dateTime: 'desc' } })
  return Response.json(data)
}

export async function POST(request, { params }) {
  const { id } = await params
  const body = await request.json()
  const result = procedureSchema.safeParse(body)
  if (!result.success) return Response.json({ error: result.error.flatten() }, { status: 400 })

  const { dateTime, ...rest } = result.data
  const data = await prisma.procedureRecord.create({
    data: { patientId: id, ...rest, ...(dateTime && { dateTime: new Date(dateTime) }) },
  })
  return Response.json(data, { status: 201 })
}
