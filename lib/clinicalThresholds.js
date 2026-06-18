export const thresholds = {
  temperature: { min: 36.0, max: 37.5 },
  pulse: { min: 60, max: 100 },
  respiration: { min: 12, max: 20 },
  spo2: { min: 95, max: 100 },
  systolic: { min: 90, max: 140 },
  diastolic: { min: 60, max: 90 },
  gcs: { min: 13, max: 15 },
}

export function isAbnormal(field, value) {
  const t = thresholds[field]
  if (!t || value == null) return false
  return value < t.min || value > t.max
}

export function parseBP(bp) {
  if (!bp) return null
  const [sys, dia] = bp.split('/').map(Number)
  return { systolic: sys, diastolic: dia }
}

export function getVitalAlerts(vitals) {
  if (!vitals) return []
  const alerts = []
  if (isAbnormal('temperature', vitals.temperature)) alerts.push(`Temp ${vitals.temperature}°C`)
  if (isAbnormal('pulse', vitals.pulse)) alerts.push(`Pulse ${vitals.pulse}`)
  if (isAbnormal('respiration', vitals.respiration)) alerts.push(`RR ${vitals.respiration}`)
  if (isAbnormal('spo2', vitals.spo2)) alerts.push(`SpO₂ ${vitals.spo2}%`)
  if (vitals.bp) {
    const bp = parseBP(vitals.bp)
    if (bp) {
      if (isAbnormal('systolic', bp.systolic)) alerts.push(`BP ${vitals.bp}`)
    }
  }
  return alerts
}
