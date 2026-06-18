import { z } from 'zod'

export const ventilatorSchema = z.object({
  inUse: z.boolean(),
  mode: z.string().optional(),
  settings: z.string().optional(),
})

export const oxygenTherapySchema = z.object({
  flowRate: z.string().min(1),
  deliveryMethod: z.string().min(1),
})

export const ecgMonitoringSchema = z.object({
  inUse: z.boolean(),
  notes: z.string().optional(),
})

export const criticalObservationSchema = z.object({
  suddenChanges: z.string().min(1),
  emergencyInterventions: z.string().optional(),
  nurseName: z.string().min(1),
  recordedAt: z.string().optional(),
})
