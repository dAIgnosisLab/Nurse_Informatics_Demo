import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import VitalsBadge from '@/components/VitalsBadge'
import AlertBanner from '@/components/AlertBanner'
import FormCompletionList from '@/components/FormCompletionList'
import { getVitalAlerts } from '@/lib/clinicalThresholds'
import { format } from 'date-fns'

async function getPatient(id) {
  try {
    return await prisma.patient.findUnique({
      where: { id },
      include: {
        vitalSigns: { orderBy: { recordedAt: 'desc' }, take: 1 },
        ventilatorSupport: true, oxygenTherapy: true, ecgMonitoring: true,
        criticalObs: { orderBy: { recordedAt: 'desc' }, take: 3 },
        medications: { orderBy: { createdAt: 'desc' } },
        intakeOutputs: true,
        nursingNotes: { orderBy: { recordedAt: 'desc' }, take: 1 },
        generalCondition: true,
        dietChart: true, treatmentCardexes: true, ivFluids: true,
        bloodTransfusions: true, procedures: true, activityLogs: true,
        preOpChecklist: true, dischargeSummary: true,
      },
    })
  } catch { return null }
}

export default async function ICUPatientDashboard({ params }) {
  const { id } = await params
  const p = await getPatient(id)
  if (!p) notFound()

  const latestVital = p.vitalSigns[0]
  const alerts = getVitalAlerts(latestVital)

  const pendingMeds = p.medications.filter((m) => !m.timeGiven).length
  const totalIntake = p.intakeOutputs.filter((io) => io.type === 'Intake').reduce((s, r) => s + r.quantity, 0)
  const totalOutput = p.intakeOutputs.filter((io) => io.type === 'Output').reduce((s, r) => s + r.quantity, 0)

  const icuForms = [
    { label: 'Ventilator Support', href: `/icu/${id}/ventilator`, filled: !!p.ventilatorSupport },
    { label: 'Oxygen Therapy', href: `/icu/${id}/oxygen-therapy`, filled: !!p.oxygenTherapy },
    { label: 'ECG Monitoring', href: `/icu/${id}/ecg-monitoring`, filled: !!p.ecgMonitoring },
    { label: 'Critical Observations', href: `/icu/${id}/critical-observations`, filled: p.criticalObs.length > 0 },
  ]

  const sharedForms = [
    { label: 'General Condition', href: `/ipd/${id}/general-condition`, filled: !!p.generalCondition },
    { label: 'Vital Signs', href: `/ipd/${id}/vitals`, filled: p.vitalSigns.length > 0 },
    { label: 'Medications', href: `/ipd/${id}/medications`, filled: p.medications.length > 0 },
    { label: 'Intake / Output', href: `/ipd/${id}/intake-output`, filled: p.intakeOutputs.length > 0 },
    { label: 'Nursing Notes', href: `/ipd/${id}/nursing-notes`, filled: p.nursingNotes.length > 0 },
    { label: 'Treatment Cardex', href: `/ipd/${id}/treatment-cardex`, filled: p.treatmentCardexes.length > 0 },
    { label: 'IV Fluids', href: `/ipd/${id}/iv-fluids`, filled: p.ivFluids.length > 0 },
    { label: 'Discharge Summary', href: `/ipd/${id}/discharge-summary`, filled: !!p.dischargeSummary },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center justify-between">
        <Link href="/icu" className="text-sm text-blue-600 hover:underline">← ICU Dashboard</Link>
        <div className="flex gap-2">
          <Link href={`/icu/${id}/transfer`} className="text-sm px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Transfer</Link>
          <Link href={`/ipd/${id}/discharge-summary`} className="text-sm px-3 py-1.5 bg-gray-700 text-white rounded-lg hover:bg-gray-800">Discharge</Link>
        </div>
      </div>

      {/* Patient Header */}
      <div className="bg-white rounded-xl border-2 border-purple-200 shadow-sm p-5">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{p.name}</h1>
              {p.ventilatorSupport?.inUse && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold border border-red-300">VENTILATOR</span>
              )}
            </div>
            <p className="text-gray-500 text-sm mt-0.5">
              {p.age}y · {p.sex}
              {p.bedNumber && <span> · Bed {p.bedNumber}</span>}
            </p>
            {p.diagnosis && <p className="text-sm text-purple-700 font-medium mt-1">{p.diagnosis}</p>}
          </div>
          <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">{p.status}</span>
        </div>
        {latestVital && <div className="mt-3"><VitalsBadge vitals={latestVital} /></div>}
      </div>

      {alerts.length > 0 && <AlertBanner alerts={alerts} />}

      {/* Critical Observations — prominent at top */}
      {p.criticalObs.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-red-700">Critical Observations</h3>
            <Link href={`/icu/${id}/critical-observations`} className="text-xs text-red-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-2">
            {p.criticalObs.map((obs) => (
              <div key={obs.id} className="text-sm">
                <span className="text-red-600 font-medium">{format(new Date(obs.recordedAt), 'dd MMM HH:mm')} — </span>
                <span className="text-gray-800">{obs.suddenChanges}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ICU Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <ICUStatusCard title="Ventilator" active={p.ventilatorSupport?.inUse} value={p.ventilatorSupport?.mode ?? 'Not set'} href={`/icu/${id}/ventilator`} />
        <ICUStatusCard title="O₂ Therapy" active={!!p.oxygenTherapy} value={p.oxygenTherapy?.flowRate ?? 'Not set'} href={`/icu/${id}/oxygen-therapy`} />
        <ICUStatusCard title="ECG Monitor" active={p.ecgMonitoring?.inUse} value={p.ecgMonitoring?.inUse ? 'Active' : 'Inactive'} href={`/icu/${id}/ecg-monitoring`} />
        <SummaryCard title="I/O Balance" value={`${(totalIntake - totalOutput).toFixed(0)} mL`} warn={false} href={`/ipd/${id}/intake-output`} />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">ICU-Specific</h3>
          <FormCompletionList forms={icuForms} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">General Care</h3>
          <FormCompletionList forms={sharedForms} />
        </div>
      </div>
    </div>
  )
}

function ICUStatusCard({ title, active, value, href }) {
  return (
    <Link href={href} className="block">
      <div className={`bg-white rounded-xl border p-4 hover:shadow-md transition-all ${active ? 'border-purple-300 bg-purple-50' : 'border-gray-200'}`}>
        <p className="text-xs text-gray-500 font-medium">{title}</p>
        <p className={`text-sm font-bold mt-1 ${active ? 'text-purple-700' : 'text-gray-500'}`}>{value}</p>
        <span className={`text-xs mt-1 inline-block px-1.5 py-0.5 rounded-full ${active ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'}`}>
          {active ? 'Active' : 'Off'}
        </span>
      </div>
    </Link>
  )
}

function SummaryCard({ title, value, warn, href }) {
  return (
    <Link href={href} className="block">
      <div className={`bg-white rounded-xl border p-4 hover:shadow-md transition-all ${warn ? 'border-amber-300' : 'border-gray-200'}`}>
        <p className="text-xs text-gray-500 font-medium">{title}</p>
        <p className="text-lg font-bold text-gray-800 mt-1">{value}</p>
      </div>
    </Link>
  )
}
