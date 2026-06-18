import prisma from '@/lib/prisma'
import { investigationSchema } from '@/lib/validation/patient'

export async function GET(request, { params }) {
  const { id } = await params
  const data = await prisma.investigation.findMany({ where: { patientId: id }, orderBy: { createdAt: 'asc' } })
  return Response.json(data)
}

export async function POST(request, { params }) {
  const { id } = await params
  const body = await request.json()
  const result = investigationSchema.safeParse(body)
  if (!result.success) return Response.json({ error: result.error.flatten() }, { status: 400 })

  const data = await prisma.investigation.create({ data: { patientId: id, ...result.data } })
  return Response.json(data, { status: 201 })
}
