'use client'

import Link from 'next/link'

const triageColors = {
  Red: 'bg-red-100 text-red-800 border-red-300',
  Yellow: 'bg-amber-100 text-amber-800 border-amber-300',
  Green: 'bg-emerald-100 text-emerald-800 border-emerald-300',
}

const triageLabels = {
  Red: 'Red - immediate',
  Yellow: 'Yellow - urgent',
  Green: 'Green - stable',
}

const statusColors = {
  Waiting: 'bg-amber-100 text-amber-800 border-amber-200',
  UnderTreatment: 'bg-blue-100 text-blue-800 border-blue-200',
  Admitted: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Transferred: 'bg-violet-100 text-violet-800 border-violet-200',
  Discharged: 'bg-slate-100 text-slate-600 border-slate-200',
}

const statusLabels = {
  UnderTreatment: 'Under treatment',
}

export default function PatientCard({ patient, href }) {
  const triage = patient.triage?.triageCode
  const latestVital = patient.vitalSigns?.[0] ?? patient.erVitals
  const detailItems = [
    `${patient.age} years`,
    patient.sex,
    patient.ipNumber ? `IP ${patient.ipNumber}` : null,
    patient.bedNumber ? `Bed ${patient.bedNumber}` : null,
    patient.ward,
  ].filter(Boolean)

  return (
    <Link href={href} className="block" aria-label={`Open patient record for ${patient.name}`}>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:bg-blue-50/40 hover:shadow-md sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-slate-950">{patient.name}</h3>
              {triage && (
                <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${triageColors[triage]}`}>
                  {triageLabels[triage] ?? triage}
                </span>
              )}
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {detailItems.map((item) => (
                <span key={item} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {item}
                </span>
              ))}
            </div>

            {patient.diagnosis && (
              <p className="mt-3 text-sm font-medium text-slate-700">{patient.diagnosis}</p>
            )}
          </div>

          <div className="flex flex-row flex-wrap gap-2 sm:flex-col sm:items-end">
            <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusColors[patient.status] ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
              {statusLabels[patient.status] ?? patient.status}
            </span>
            {patient.ventilatorSupport?.inUse && (
              <span className="rounded-full border border-red-300 bg-red-100 px-3 py-1 text-xs font-bold text-red-800">
                On ventilator
              </span>
            )}
          </div>
        </div>

        {latestVital ? (
          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4 text-sm sm:grid-cols-4">
            {latestVital.bp && <VitalPill label="BP" value={latestVital.bp} />}
            {latestVital.pulse && <VitalPill label="Pulse" value={latestVital.pulse} />}
            {latestVital.spo2 && <VitalPill label="SpO2" value={`${latestVital.spo2}%`} warning={latestVital.spo2 < 95} />}
            {latestVital.temperature && <VitalPill label="Temp" value={`${latestVital.temperature} C`} warning={latestVital.temperature > 37.5} />}
          </div>
        ) : (
          <p className="mt-4 rounded-xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-500">
            No vitals recorded yet
          </p>
        )}
      </div>
    </Link>
  )
}

function VitalPill({ label, value, warning = false }) {
  return (
    <div className={`rounded-xl border px-3 py-2 ${warning ? 'border-red-200 bg-red-50' : 'border-slate-200 bg-slate-50'}`}>
      <p className={`text-xs font-semibold ${warning ? 'text-red-600' : 'text-slate-500'}`}>{label}</p>
      <p className={`font-bold ${warning ? 'text-red-800' : 'text-slate-800'}`}>{value}</p>
    </div>
  )
}
