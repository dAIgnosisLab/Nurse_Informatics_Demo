'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import FormShell from '@/components/forms/FormShell'

export default function PreOpClient({ patientId, existing }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    consentTaken: existing?.consentTaken ?? false,
    fastingStatus: existing?.fastingStatus ?? 'NPO since midnight',
    investigationsCompleted: existing?.investigationsCompleted ?? false,
  })
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/patients/${patientId}/pre-op-checklist`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to save')
      router.push(`/ipd/${patientId}`)
    } catch (e) {
      setError(e.message); setSaving(false)
    }
  }

  return (
    <FormShell title="Pre-Op Checklist" backHref={`/ipd/${patientId}`} backLabel="Patient Dashboard" onSave={handleSave} saving={saving}>
      {error && <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
      <div className="space-y-5">
        {[['consentTaken', 'Surgical Consent Taken'], ['investigationsCompleted', 'Pre-Op Investigations Completed']].map(([key, label]) => (
          <label key={key} className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <input type="checkbox" checked={form[key]} onChange={(e) => set(key, e.target.checked)} className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </label>
        ))}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fasting Status</label>
          <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.fastingStatus} onChange={(e) => set('fastingStatus', e.target.value)}>
            <option value="">Select…</option>
            <option>NPO since midnight</option>
            <option>NPO 6 hours</option>
            <option>Clear liquids allowed</option>
            <option>Not fasting</option>
          </select>
        </div>
      </div>
    </FormShell>
  )
}
