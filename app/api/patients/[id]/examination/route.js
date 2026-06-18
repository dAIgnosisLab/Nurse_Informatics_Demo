import prisma from '@/lib/prisma'
import { examinationSchema } from '@/lib/validation/patient'

export async function GET(request, { params }) {
  const { id } = await params
  const data = await prisma.examination.findUnique({ where: { patientId: id } })
  return Response.json(data)
}

export async function POST(request, { params }) {
  const { id } = await params
  const body = await request.json()
  const result = examinationSchema.safeParse(body)
  if (!result.success) return Response.json({ error: result.error.flatten() }, { status: 400 })

  const data = await prisma.examination.upsert({
    where: { patientId: id },
    update: result.data,
    create: { patientId: id, ...result.data },
  })
  return Response.json(data)
}
