'use client'

import Link from 'next/link'

const triageColors = {
  Red: 'bg-red-100 text-red-800 border-red-300',
  Yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  Green: 'bg-green-100 text-green-800 border-green-300',
}

const statusColors = {
  Waiting: 'bg-orange-100 text-orange-700',
  UnderTreatment: 'bg-blue-100 text-blue-700',
  Admitted: 'bg-green-100 text-green-700',
  Transferred: 'bg-purple-100 text-purple-700',
  Discharged: 'bg-gray-100 text-gray-500',
}

export default function PatientCard({ patient, href }) {
  const triage = patient.triage?.triageCode
  const latestVital = patient.vitalSigns?.[0] ?? patient.erVitals

  return (
    <Link href={href} className="block">
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-gray-900 truncate">{patient.name}</h3>
              {triage && (
                <span className={`text-xs px-2 py-0.5 rounded border font-bold ${triageColors[triage]}`}>
                  {triage}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              {patient.age}y · {patient.sex}
              {patient.bedNumber && <span> · Bed {patient.bedNumber}</span>}
              {patient.ward && <span> · {patient.ward}</span>}
            </p>
            {patient.diagnosis && (
              <p className="text-sm text-gray-700 mt-1 truncate">{patient.diagnosis}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[patient.status] ?? 'bg-gray-100 text-gray-600'}`}>
              {patient.status}
            </span>
            {patient.ventilatorSupport?.inUse && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">Ventilator</span>
            )}
          </div>
        </div>
        {latestVital && (
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500 border-t border-gray-100 pt-2">
            {latestVital.bp && <span>BP {latestVital.bp}</span>}
            {latestVital.pulse && <span>HR {latestVital.pulse}</span>}
            {latestVital.spo2 && (
              <span className={latestVital.spo2 < 95 ? 'text-red-600 font-semibold' : ''}>
                SpO₂ {latestVital.spo2}%
              </span>
            )}
            {latestVital.temperature && (
              <span className={latestVital.temperature > 37.5 ? 'text-red-600 font-semibold' : ''}>
                Temp {latestVital.temperature}°C
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
