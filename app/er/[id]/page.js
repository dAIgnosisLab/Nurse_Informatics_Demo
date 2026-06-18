import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import VitalsBadge from '@/components/VitalsBadge'
import AlertBanner from '@/components/AlertBanner'
import { getVitalAlerts } from '@/lib/clinicalThresholds'

async function getPatient(id) {
  try {
    return await prisma.patient.findUnique({
      where: { id },
      include: {
        erIntake: true, triage: true, erVitals: true, examination: true,
        clinicalDetails: true, investigations: true, provisionalDx: true,
      },
    })
  } catch { return null }
}

const triageColors = { Red: 'bg-red-100 text-red-700 border-red-300', Yellow: 'bg-yellow-100 text-yellow-700 border-yellow-300', Green: 'bg-green-100 text-green-700 border-green-300' }

export default async function ERPatientSummary({ params }) {
  const { id } = await params
  const patient = await getPatient(id)
  if (!patient) notFound()

  const alerts = getVitalAlerts(patient.erVitals)

  const steps = [
    { label: 'ER Intake', done: !!patient.erIntake, href: `/er/${id}/triage` },
    { label: 'Triage', done: !!patient.triage, href: `/er/${id}/triage` },
    { label: 'Initial Vitals', done: !!patient.erVitals, href: `/er/${id}/vitals` },
    { label: 'Examination', done: !!patient.examination, href: `/er/${id}/examination` },
    { label: 'Clinical Details', done: !!patient.clinicalDetails, href: `/er/${id}/clinical-details` },
    { label: 'Investigations', done: patient.investigations.length > 0, href: `/er/${id}/investigations` },
    { label: 'Provisional Diagnosis', done: !!patient.provisionalDx, href: `/er/${id}/diagnosis` },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center gap-2 mb-2">
        <Link href="/er" className="text-sm text-blue-600 hover:underline">← ER Dashboard</Link>
      </div>

      {/* Patient Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
            <p className="text-gray-500 text-sm mt-0.5">{patient.age}y · {patient.sex}{patient.diagnosis && ` · ${patient.diagnosis}`}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {patient.triage?.triageCode && (
              <span className={`px-3 py-1 rounded border text-sm font-bold ${triageColors[patient.triage.triageCode]}`}>
                {patient.triage.triageCode}
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-medium">
              {patient.status}
            </span>
          </div>
        </div>
        {patient.erVitals && (
          <div className="mt-3">
            <VitalsBadge vitals={patient.erVitals} />
          </div>
        )}
      </div>

      {alerts.length > 0 && <AlertBanner alerts={alerts} />}

      {/* Form Completion */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-gray-700">Assessment Progress</h2>
        </div>
        <ul className="divide-y divide-gray-100">
          {steps.map((s) => (
            <li key={s.label}>
              <Link href={s.href} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                <span className="text-sm text-gray-700">{s.label}</span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${s.done ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {s.done ? 'Filled' : 'Pending'}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Details Sections */}
      {patient.erIntake && (
        <Section title="Intake" editHref={`/er/${id}/triage`}>
          <Row label="Brought By" value={patient.erIntake.broughtBy} />
          <Row label="Relation" value={patient.erIntake.relation} />
        </Section>
      )}

      {patient.clinicalDetails && (
        <Section title="Clinical Details" editHref={`/er/${id}/clinical-details`}>
          <Row label="Chief Complaints" value={patient.clinicalDetails.chiefComplaints} />
          {patient.clinicalDetails.pastHistory && <Row label="Past History" value={patient.clinicalDetails.pastHistory} />}
          {patient.clinicalDetails.drugAllergyHistory && <Row label="Drug / Allergy" value={patient.clinicalDetails.drugAllergyHistory} />}
        </Section>
      )}

      {patient.investigations.length > 0 && (
        <Section title="Investigations" editHref={`/er/${id}/investigations`}>
          <div className="flex flex-wrap gap-2">
            {patient.investigations.map((inv) => (
              <span key={inv.id} className={`px-3 py-1 rounded-full text-xs font-medium ${
                inv.status === 'Completed' ? 'bg-green-100 text-green-700' :
                inv.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                {inv.type} — {inv.status}
              </span>
            ))}
          </div>
        </Section>
      )}

      {patient.provisionalDx && (
        <Section title="Provisional Diagnosis" editHref={`/er/${id}/diagnosis`}>
          <p className="text-sm text-gray-800">{patient.provisionalDx.diagnosisText}</p>
        </Section>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href={`/er/${id}/transfer`}
          className="flex-1 text-center px-4 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors text-sm"
        >
          Transfer Patient →
        </Link>
        <Link
          href={`/er/${id}/transfer?discharge=1`}
          className="flex-1 text-center px-4 py-2.5 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors text-sm"
        >
          Discharge from ER
        </Link>
      </div>
    </div>
  )
}

function Section({ title, editHref, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <h3 className="font-semibold text-gray-700">{title}</h3>
        <Link href={editHref} className="text-xs text-blue-600 hover:underline">Edit</Link>
      </div>
      <div className="px-5 py-4 space-y-2">{children}</div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-gray-500 min-w-32 shrink-0">{label}:</span>
      <span className="text-gray-800">{value}</span>
    </div>
  )
}
