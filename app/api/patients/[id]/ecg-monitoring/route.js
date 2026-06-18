import prisma from '@/lib/prisma'
import { ecgMonitoringSchema } from '@/lib/validation/icu'

export async function GET(request, { params }) {
  const { id } = await params
  const data = await prisma.ecgMonitoring.findUnique({ where: { patientId: id } })
  return Response.json(data)
}

export async function POST(request, { params }) {
  const { id } = await params
  const body = await request.json()
  const result = ecgMonitoringSchema.safeParse(body)
  if (!result.success) return Response.json({ error: result.error.flatten() }, { status: 400 })

  const data = await prisma.ecgMonitoring.upsert({
    where: { patientId: id },
    update: result.data,
    create: { patientId: id, ...result.data },
  })
  return Response.json(data)
}
