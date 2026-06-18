import prisma from '@/lib/prisma'
import { ivFluidSchema } from '@/lib/validation/clinical'

export async function GET(request, { params }) {
  const { id } = await params
  const data = await prisma.ivFluid.findMany({ where: { patientId: id }, orderBy: { createdAt: 'desc' } })
  return Response.json(data)
}

export async function POST(request, { params }) {
  const { id } = await params
  const body = await request.json()
  const result = ivFluidSchema.safeParse(body)
  if (!result.success) return Response.json({ error: result.error.flatten() }, { status: 400 })

  const { startTime, endTime, ...rest } = result.data
  const data = await prisma.ivFluid.create({
    data: {
      patientId: id,
      ...rest,
      startTime: new Date(startTime),
      ...(endTime && { endTime: new Date(endTime) }),
    },
  })
  return Response.json(data, { status: 201 })
}
