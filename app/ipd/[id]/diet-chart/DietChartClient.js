'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import FormShell from '@/components/forms/FormShell'

export default function DietChartClient({ patientId, existing }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    dietType: existing?.dietType ?? '',
    restrictions: existing?.restrictions ?? '',
    feedingMethod: existing?.feedingMethod ?? '',
  })
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  async function handleSave() {
    if (!form.dietType) { setError('Diet type is required.'); return }
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/patients/${patientId}/diet-chart`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to save')
      router.push(`/ipd/${patientId}`)
    } catch (e) {
      setError(e.message); setSaving(false)
    }
  }

  return (
    <FormShell title="Diet Chart" backHref={`/ipd/${patientId}`} backLabel="Patient Dashboard" onSave={handleSave} saving={saving}>
      {error && <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Diet Type *</label>
          <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.dietType} onChange={(e) => set('dietType', e.target.value)}>
            <option value="">Select…</option>
            {['Regular', 'Soft', 'Liquid', 'NPO (Nil Per Oral)', 'High Protein', 'Low Sodium', 'Diabetic', 'Other'].map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Restrictions / Allergies</label>
          <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.restrictions} onChange={(e) => set('restrictions', e.target.value)} placeholder="e.g. No spicy food, gluten-free" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Feeding Method</label>
          <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.feedingMethod} onChange={(e) => set('feedingMethod', e.target.value)}>
            <option value="">Select…</option>
            {['Self', 'Assisted', 'NG Tube', 'IV Only'].map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>
      </div>
    </FormShell>
  )
}
