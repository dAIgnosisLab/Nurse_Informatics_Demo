import prisma from '@/lib/prisma'
import { patientSchema } from '@/lib/validation/patient'

export async function GET(request) {
  const { searchParams } = request.nextUrl
  const department = searchParams.get('department')

  const where = department ? { department } : {}

  const patients = await prisma.patient.findMany({
    where,
    include: {
      triage: true,
      erVitals: true,
      vitalSigns: { orderBy: { recordedAt: 'desc' }, take: 1 },
      ventilatorSupport: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return Response.json(patients)
}

export async function POST(request) {
  const body = await request.json()
  const result = patientSchema.safeParse(body)
  if (!result.success) {
    return Response.json({ error: result.error.flatten() }, { status: 400 })
  }

  const patient = await prisma.patient.create({ data: result.data })
  return Response.json(patient, { status: 201 })
}
