import prisma from '@/lib/prisma'
import { provisionalDiagnosisSchema } from '@/lib/validation/patient'

export async function GET(request, { params }) {
  const { id } = await params
  const data = await prisma.provisionalDiagnosis.findUnique({ where: { patientId: id } })
  return Response.json(data)
}

export async function POST(request, { params }) {
  const { id } = await params
  const body = await request.json()
  const result = provisionalDiagnosisSchema.safeParse(body)
  if (!result.success) return Response.json({ error: result.error.flatten() }, { status: 400 })

  const data = await prisma.provisionalDiagnosis.upsert({
    where: { patientId: id },
    update: result.data,
    create: { patientId: id, ...result.data },
  })
  await prisma.patient.update({ where: { id }, data: { diagnosis: result.data.diagnosisText } })
  return Response.json(data)
}
