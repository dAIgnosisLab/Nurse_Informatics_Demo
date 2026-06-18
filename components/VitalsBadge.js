import { isAbnormal, parseBP } from '@/lib/clinicalThresholds'

export default function VitalsBadge({ vitals }) {
  if (!vitals) return null

  const bp = vitals.bp ? parseBP(vitals.bp) : null
  const items = [
    { label: 'BP', value: vitals.bp, abnormal: bp && isAbnormal('systolic', bp.systolic) },
    { label: 'Pulse', value: vitals.pulse ? `${vitals.pulse}` : null, abnormal: isAbnormal('pulse', vitals.pulse) },
    { label: 'Resp', value: vitals.respiration ? `${vitals.respiration}` : null, abnormal: isAbnormal('respiration', vitals.respiration) },
    { label: 'SpO2', value: vitals.spo2 ? `${vitals.spo2}%` : null, abnormal: isAbnormal('spo2', vitals.spo2) },
    { label: 'Temp', value: vitals.temperature ? `${vitals.temperature} C` : null, abnormal: isAbnormal('temperature', vitals.temperature) },
  ].filter((item) => item.value)

  if (!items.length) return null

  return (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
      {items.map((item) => (
        <div
          key={item.label}
          className={`rounded-xl border px-3 py-2 ${
            item.abnormal ? 'border-red-200 bg-red-50' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <p className={`text-xs font-bold ${item.abnormal ? 'text-red-600' : 'text-slate-500'}`}>{item.label}</p>
            {item.abnormal && (
              <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-black uppercase text-white">
                Check
              </span>
            )}
          </div>
          <p className={`mt-1 text-base font-bold ${item.abnormal ? 'text-red-900' : 'text-slate-900'}`}>
            {item.value}
          </p>
        </div>
      ))}
    </div>
  )
}
