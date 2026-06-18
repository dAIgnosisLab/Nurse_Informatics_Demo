import prisma from '@/lib/prisma'
import { nursingNoteSchema } from '@/lib/validation/clinical'

export async function GET(request, { params }) {
  const { id } = await params
  const data = await prisma.nursingNote.findMany({ where: { patientId: id }, orderBy: { recordedAt: 'desc' } })
  return Response.json(data)
}

export async function POST(request, { params }) {
  const { id } = await params
  const body = await request.json()
  const result = nursingNoteSchema.safeParse(body)
  if (!result.success) return Response.json({ error: result.error.flatten() }, { status: 400 })

  const data = await prisma.nursingNote.create({ data: { patientId: id, ...result.data } })
  return Response.json(data, { status: 201 })
}
