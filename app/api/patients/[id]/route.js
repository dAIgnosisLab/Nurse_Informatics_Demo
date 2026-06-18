import prisma from '@/lib/prisma'
import { patientSchema } from '@/lib/validation/patient'

export async function GET(request, { params }) {
  const { id } = await params

  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      erIntake: true,
      triage: true,
      erVitals: true,
      examination: true,
      clinicalDetails: true,
      investigations: true,
      provisionalDx: true,
      generalCondition: true,
      vitalSigns: { orderBy: { recordedAt: 'desc' } },
      intakeOutputs: { orderBy: { recordedAt: 'desc' } },
      activityLogs: { orderBy: { recordedAt: 'desc' } },
      medications: { orderBy: { createdAt: 'desc' } },
      treatmentCardexes: { orderBy: { date: 'desc' } },
      ivFluids: { orderBy: { createdAt: 'desc' } },
      bloodTransfusions: { orderBy: { createdAt: 'desc' } },
      dietChart: true,
      nursingNotes: { orderBy: { recordedAt: 'desc' } },
      procedures: { orderBy: { dateTime: 'desc' } },
      preOpChecklist: true,
      dischargeSummary: true,
      ventilatorSupport: true,
      oxygenTherapy: true,
      ecgMonitoring: true,
      criticalObs: { orderBy: { recordedAt: 'desc' } },
      transfers: { orderBy: { transferredAt: 'desc' } },
    },
  })

  if (!patient) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(patient)
}

export async function PATCH(request, { params }) {
  const { id } = await params
  const body = await request.json()
  const result = patientSchema.partial().safeParse(body)
  if (!result.success) {
    return Response.json({ error: result.error.flatten() }, { status: 400 })
  }

  const patient = await prisma.patient.update({ where: { id }, data: result.data })
  return Response.json(patient)
}

export async function DELETE(request, { params }) {
  const { id } = await params
  await prisma.patient.delete({ where: { id } })
  return new Response(null, { status: 204 })
}
