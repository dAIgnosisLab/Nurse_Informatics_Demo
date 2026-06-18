import { z } from 'zod'

export const patientSchema = z.object({
  name: z.string().min(1),
  age: z.number().int().positive(),
  sex: z.enum(['Male', 'Female', 'Other']),
  department: z.enum(['ER', 'IPD', 'ICU']),
  diagnosis: z.string().optional(),
  bedNumber: z.string().optional(),
  ward: z.string().optional(),
  ipNumber: z.string().optional(),
})

export const erIntakeSchema = z.object({
  broughtBy: z.string().min(1),
  relation: z.string().min(1),
  arrivalDateTime: z.string().datetime().optional(),
})

export const triageSchema = z.object({
  triageCode: z.enum(['Red', 'Yellow', 'Green']),
})

export const erVitalsSchema = z.object({
  temperature: z.number().optional(),
  pulse: z.number().optional(),
  respiration: z.number().optional(),
  bp: z.string().optional(),
  spo2: z.number().optional(),
  gcs: z.number().optional(),
})

export const examinationSchema = z.object({
  airwayStatus: z.enum(['Normal', 'Abnormal']).optional(),
  airwayNotes: z.string().optional(),
  breathingStatus: z.enum(['Normal', 'Abnormal']).optional(),
  breathingNotes: z.string().optional(),
  circulationStatus: z.enum(['Normal', 'Abnormal']).optional(),
  circulationNotes: z.string().optional(),
  pupilsStatus: z.enum(['Normal', 'Abnormal']).optional(),
  pupilsNotes: z.string().optional(),
  abdomenStatus: z.enum(['Normal', 'Abnormal']).optional(),
  abdomenNotes: z.string().optional(),
})

export const clinicalDetailsSchema = z.object({
  chiefComplaints: z.string().min(1),
  pastHistory: z.string().optional(),
  drugAllergyHistory: z.string().optional(),
  personalHistory: z.string().optional(),
})

export const investigationSchema = z.object({
  type: z.enum(['CBC', 'RBS', 'ECG', 'Xray', 'Other']),
  status: z.enum(['Ordered', 'Pending', 'Completed']),
  notes: z.string().optional(),
})

export const provisionalDiagnosisSchema = z.object({
  diagnosisText: z.string().min(1),
})
