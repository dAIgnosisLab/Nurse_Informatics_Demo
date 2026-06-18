import prisma from '@/lib/prisma'
import { ventilatorSchema } from '@/lib/validation/icu'

export async function GET(request, { params }) {
  const { id } = await params
  const data = await prisma.ventilatorSupport.findUnique({ where: { patientId: id } })
  return Response.json(data)
}

export async function POST(request, { params }) {
  const { id } = await params
  const body = await request.json()
  const result = ventilatorSchema.safeParse(body)
  if (!result.success) return Response.json({ error: result.error.flatten() }, { status: 400 })

  const data = await prisma.ventilatorSupport.upsert({
    where: { patientId: id },
    update: result.data,
    create: { patientId: id, ...result.data },
  })
  return Response.json(data)
}
