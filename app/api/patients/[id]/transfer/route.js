import prisma from '@/lib/prisma'

export async function POST(request, { params }) {
  const { id } = await params
  const { toDepartment, bedNumber, ward, notes } = await request.json()

  if (!toDepartment) {
    return Response.json({ error: 'toDepartment is required' }, { status: 400 })
  }

  const patient = await prisma.patient.findUnique({ where: { id } })
  if (!patient) return Response.json({ error: 'Not found' }, { status: 404 })

  const [updated] = await prisma.$transaction([
    prisma.patient.update({
      where: { id },
      data: {
        department: toDepartment,
        status: 'Admitted',
        ...(bedNumber && { bedNumber }),
        ...(ward && { ward }),
      },
    }),
    prisma.transferRecord.create({
      data: {
        patientId: id,
        fromDepartment: patient.department,
        toDepartment,
        notes: notes ?? null,
      },
    }),
  ])

  return Response.json(updated)
}
