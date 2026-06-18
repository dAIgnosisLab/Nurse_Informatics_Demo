import prisma from '@/lib/prisma'
import { intakeOutputSchema } from '@/lib/validation/clinical'

export async function GET(request, { params }) {
  const { id } = await params
  const data = await prisma.intakeOutput.findMany({ where: { patientId: id }, orderBy: { recordedAt: 'desc' } })
  return Response.json(data)
}

export async function POST(request, { params }) {
  const { id } = await params
  const body = await request.json()
  const result = intakeOutputSchema.safeParse(body)
  if (!result.success) return Response.json({ error: result.error.flatten() }, { status: 400 })

  const { recordedAt, ...rest } = result.data
  const data = await prisma.intakeOutput.create({
    data: { patientId: id, ...rest, ...(recordedAt && { recordedAt: new Date(recordedAt) }) },
  })
  return Response.json(data, { status: 201 })
}
