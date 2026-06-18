'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import FormShell from '@/components/forms/FormShell'

export default function DischargeSummaryClient({ patientId, existing }) {
  const router = useRouter()
  const dept = usePathname().startsWith('/icu/') ? 'icu' : 'ipd'
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [confirm, setConfirm] = useState(false)
  const [form, setForm] = useState({
    finalDiagnosis: existing?.finalDiagnosis ?? 'Community Acquired Pneumonia',
    treatmentSummary: existing?.treatmentSummary ?? 'Patient treated with IV antibiotics and supportive care. Condition improved significantly over the admission period.',
    medicationsAtDischarge: existing?.medicationsAtDischarge ?? 'Tab. Amoxicillin 500mg TDS × 5 days\nTab. Paracetamol 500mg SOS',
    advice: existing?.advice ?? 'Rest at home. Plenty of fluids. Follow up after 1 week. Return if symptoms worsen.',
    conditionAtDischarge: existing?.conditionAtDischarge ?? 'Stable and improved',
  })
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  async function handleSave() {
    if (!form.finalDiagnosis) { setError('Final diagnosis is required.'); return }
    if (!confirm) { setError('Please confirm this discharge.'); return }
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/patients/${patientId}/discharge-summary`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to save')
      router.push(`/${dept}`)
    } catch (e) {
      setError(e.message); setSaving(false)
    }
  }

  return (
    <FormShell title="Discharge Summary" backHref={`/${dept}/${patientId}`} backLabel="Patient Dashboard" onSave={handleSave} saving={saving} saveLabel="Discharge Patient">
      {error && <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
      {existing && <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">Discharge summary already on file — editing will update it.</div>}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Final Diagnosis *</label>
          <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.finalDiagnosis} onChange={(e) => set('finalDiagnosis', e.target.value)} />
        </div>
        {[['Treatment Summary', 'treatmentSummary'], ['Medications at Discharge', 'medicationsAtDischarge'], ['Advice to Patient', 'advice'], ['Condition at Discharge', 'conditionAtDischarge']].map(([label, key]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <textarea rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form[key]} onChange={(e) => set(key, e.target.value)} />
          </div>
        ))}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} className="w-4 h-4" />
            <span className="text-sm text-amber-700 font-medium">I confirm this patient is being discharged. This will mark them as Discharged.</span>
          </label>
        </div>
      </div>
    </FormShell>
  )
}
