import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import VitalsBadge from '@/components/VitalsBadge'
import AlertBanner from '@/components/AlertBanner'
import FormCompletionList from '@/components/FormCompletionList'
import { getVitalAlerts } from '@/lib/clinicalThresholds'

async function getPatient(id) {
  try {
    return await prisma.patient.findUnique({
      where: { id },
      include: {
        generalCondition: true,
        vitalSigns: { orderBy: { recordedAt: 'desc' }, take: 1 },
        medications: { orderBy: { createdAt: 'desc' } },
        intakeOutputs: true,
        nursingNotes: { orderBy: { recordedAt: 'desc' }, take: 1 },
        dietChart: true,
        treatmentCardexes: { orderBy: { date: 'desc' }, take: 1 },
        ivFluids: { orderBy: { createdAt: 'desc' } },
        bloodTransfusions: true,
        procedures: true,
        activityLogs: { orderBy: { recordedAt: 'desc' }, take: 1 },
        preOpChecklist: true,
        dischargeSummary: true,
      },
    })
  } catch { return null }
}

export default async function IPDPatientDashboard({ params }) {
  const { id } = await params
  const p = await getPatient(id)
  if (!p) notFound()

  const latestVital = p.vitalSigns[0]
  const alerts = getVitalAlerts(latestVital)

  const totalMeds = p.medications.length
  const givenMeds = p.medications.filter((m) => m.timeGiven).length
  const pendingMeds = totalMeds - givenMeds

  const totalIntake = p.intakeOutputs.filter((io) => io.type === 'Intake').reduce((s, r) => s + r.quantity, 0)
  const totalOutput = p.intakeOutputs.filter((io) => io.type === 'Output').reduce((s, r) => s + r.quantity, 0)

  const forms = [
    { label: 'General Condition', href: `/ipd/${id}/general-condition`, filled: !!p.generalCondition },
    { label: 'Vital Signs', href: `/ipd/${id}/vitals`, filled: p.vitalSigns.length > 0 },
    { label: 'Intake / Output', href: `/ipd/${id}/intake-output`, filled: p.intakeOutputs.length > 0 },
    { label: 'Activity Log', href: `/ipd/${id}/activity`, filled: p.activityLogs.length > 0 },
    { label: 'Medications', href: `/ipd/${id}/medications`, filled: p.medications.length > 0 },
    { label: 'Treatment Cardex', href: `/ipd/${id}/treatment-cardex`, filled: p.treatmentCardexes.length > 0 },
    { label: 'IV Fluids', href: `/ipd/${id}/iv-fluids`, filled: p.ivFluids.length > 0 },
    { label: 'Blood Transfusion', href: `/ipd/${id}/blood-transfusion`, filled: p.bloodTransfusions.length > 0 },
    { label: 'Diet Chart', href: `/ipd/${id}/diet-chart`, filled: !!p.dietChart },
    { label: 'Nursing Notes', href: `/ipd/${id}/nursing-notes`, filled: p.nursingNotes.length > 0 },
    { label: 'Procedures', href: `/ipd/${id}/procedures`, filled: p.procedures.length > 0 },
    { label: 'Pre-Op Checklist', href: `/ipd/${id}/pre-op-checklist`, filled: !!p.preOpChecklist },
    { label: 'Discharge Summary', href: `/ipd/${id}/discharge-summary`, filled: !!p.dischargeSummary },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Link href="/ipd" className="inline-flex min-h-11 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50">← IPD Dashboard</Link>
        <div className="flex gap-2">
          <Link href={`/ipd/${id}/transfer`} className="inline-flex min-h-11 items-center px-4 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition-colors">Transfer Patient →</Link>
          <Link href={`/ipd/${id}/discharge-summary`} className="inline-flex min-h-11 items-center px-4 bg-gray-700 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors">Discharge</Link>
        </div>
      </div>

      {/* Patient Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{p.name}</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {p.age}y · {p.sex}
              {p.ipNumber && <span> · IP# {p.ipNumber}</span>}
              {p.bedNumber && <span> · Bed {p.bedNumber}</span>}
              {p.ward && <span> · {p.ward}</span>}
            </p>
            {p.diagnosis && <p className="text-sm text-blue-700 font-medium mt-1">{p.diagnosis}</p>}
          </div>
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">{p.status}</span>
        </div>
        {latestVital && <div className="mt-3"><VitalsBadge vitals={latestVital} /></div>}
      </div>

      {alerts.length > 0 && <AlertBanner alerts={alerts} />}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryCard title="Medications" value={pendingMeds > 0 ? `${pendingMeds} pending` : 'All given'} sub={`${givenMeds}/${totalMeds} given`} warn={pendingMeds > 0} href={`/ipd/${id}/medications`} />
        <SummaryCard title="I/O Balance" value={`${(totalIntake - totalOutput).toFixed(0)} mL`} sub={`In: ${totalIntake}mL · Out: ${totalOutput}mL`} href={`/ipd/${id}/intake-output`} />
        <SummaryCard title="Latest Vital" value={latestVital?.bp ?? '—'} sub={latestVital ? `SpO₂ ${latestVital.spo2 ?? '—'}%` : 'No vitals'} href={`/ipd/${id}/vitals`} />
        <SummaryCard title="Nursing Notes" value={p.nursingNotes[0]?.shift ?? '—'} sub={p.nursingNotes[0]?.nurseName ?? 'No notes yet'} href={`/ipd/${id}/nursing-notes`} />
      </div>

      <FormCompletionList forms={forms} />
    </div>
  )
}

function SummaryCard({ title, value, sub, warn, href }) {
  return (
    <Link href={href} className="block">
      <div className={`bg-white rounded-xl border p-4 hover:shadow-md transition-all ${warn ? 'border-amber-300 bg-amber-50' : 'border-gray-200'}`}>
        <p className="text-xs text-gray-500 font-medium">{title}</p>
        <p className={`text-lg font-bold mt-0.5 ${warn ? 'text-amber-700' : 'text-gray-800'}`}>{value}</p>
        <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
      </div>
    </Link>
  )
}
