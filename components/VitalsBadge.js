import { isAbnormal, parseBP } from '@/lib/clinicalThresholds'

export default function VitalsBadge({ vitals }) {
  if (!vitals) return null

  const bp = vitals.bp ? parseBP(vitals.bp) : null

  const items = [
    { label: 'BP', value: vitals.bp, abnormal: bp && isAbnormal('systolic', bp.systolic) },
    { label: 'HR', value: vitals.pulse ? `${vitals.pulse}` : null, abnormal: isAbnormal('pulse', vitals.pulse) },
    { label: 'RR', value: vitals.respiration ? `${vitals.respiration}` : null, abnormal: isAbnormal('respiration', vitals.respiration) },
    { label: 'SpO₂', value: vitals.spo2 ? `${vitals.spo2}%` : null, abnormal: isAbnormal('spo2', vitals.spo2) },
    { label: 'Temp', value: vitals.temperature ? `${vitals.temperature}°C` : null, abnormal: isAbnormal('temperature', vitals.temperature) },
  ].filter((i) => i.value)

  if (!items.length) return null

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item.label}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium ${
            item.abnormal
              ? 'bg-red-100 text-red-700 border border-red-300'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          <span className="text-gray-500">{item.label}</span>
          {item.value}
          {item.abnormal && <span className="text-red-500">!</span>}
        </span>
      ))}
    </div>
  )
}
