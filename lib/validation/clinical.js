import { z } from 'zod'

export const generalConditionSchema = z.object({
  consciousness: z.enum(['Alert', 'Confused', 'Drowsy', 'Unconscious']),
  gcsScore: z.number().int().min(3).max(15).optional(),
  painLevel: z.number().int().min(0).max(10).optional(),
  orientedTime: z.boolean().optional(),
  orientedPlace: z.boolean().optional(),
  orientedPerson: z.boolean().optional(),
})

export const vitalSignSchema = z.object({
  temperature: z.number().optional(),
  pulse: z.number().optional(),
  respiration: z.number().optional(),
  bp: z.string().optional(),
  spo2: z.number().optional(),
  nurseName: z.string().min(1),
  recordedAt: z.string().optional(),
})

export const intakeOutputSchema = z.object({
  type: z.enum(['Intake', 'Output']),
  subtype: z.enum(['OralFluid', 'IVFluid', 'TubeFeeding', 'Urine', 'Vomit', 'Stool', 'Drainage']),
  quantity: z.number().positive(),
  recordedAt: z.string().optional(),
})

export const activityLogSchema = z.object({
  activityType: z.enum(['BedRest', 'Sitting', 'Walking', 'AssistedMovement']),
  recordedAt: z.string().optional(),
})

export const medicationSchema = z.object({
  drugName: z.string().min(1),
  dose: z.string().min(1),
  route: z.string().min(1),
  timeScheduled: z.string().min(1),
  timeGiven: z.string().optional().nullable(),
  nurseSignature: z.string().optional(),
})

export const treatmentCardexSchema = z.object({
  doctorOrders: z.string().optional(),
  medicationsPrescribed: z.string().optional(),
  proceduresToDo: z.string().optional(),
  ivFluidsInstructions: z.string().optional(),
  specialInstructions: z.string().optional(),
  nurseInitials: z.string().optional(),
  date: z.string().optional(),
})

export const ivFluidSchema = z.object({
  fluidType: z.string().min(1),
  rate: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().optional().nullable(),
  volumeInfused: z.number().optional().nullable(),
})

export const bloodTransfusionSchema = z.object({
  bloodGroup: z.string().min(1),
  unitNumber: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().optional().nullable(),
  reactionNotes: z.string().optional(),
})

export const dietChartSchema = z.object({
  dietType: z.string().min(1),
  restrictions: z.string().optional(),
  feedingMethod: z.string().optional(),
})

export const nursingNoteSchema = z.object({
  shift: z.enum(['Morning', 'Evening', 'Night']),
  observations: z.string().min(1),
  interventions: z.string().optional(),
  patientResponse: z.string().optional(),
  nurseName: z.string().min(1),
})

export const procedureSchema = z.object({
  procedureName: z.string().min(1),
  dateTime: z.string().optional(),
  performedBy: z.string().min(1),
  remarks: z.string().optional(),
})

export const preOpChecklistSchema = z.object({
  consentTaken: z.boolean(),
  fastingStatus: z.string().optional(),
  investigationsCompleted: z.boolean(),
})

export const dischargeSummarySchema = z.object({
  finalDiagnosis: z.string().min(1),
  treatmentSummary: z.string().optional(),
  medicationsAtDischarge: z.string().optional(),
  advice: z.string().optional(),
  conditionAtDischarge: z.string().optional(),
})
