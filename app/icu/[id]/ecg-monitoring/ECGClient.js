'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import FormShell from '@/components/forms/FormShell'

export default function ECGClient({ patientId, existing }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ inUse: existing?.inUse ?? true, notes: existing?.notes ?? 'Sinus rhythm, rate 80/min. No ST changes noted.' })
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/patients/${patientId}/ecg-monitoring`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to save')
      router.push(`/icu/${patientId}`)
    } catch (e) {
      setError(e.message); setSaving(false)
    }
  }

  return (
    <FormShell title="ECG Monitoring" backHref={`/icu/${patientId}`} backLabel="ICU Dashboard" onSave={handleSave} saving={saving}>
      {error && <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
      <div className="space-y-4">
        <label className="flex items-center gap-3 cursor-pointer p-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50">
          <input type="checkbox" checked={form.inUse} onChange={(e) => set('inUse', e.target.checked)} className="w-5 h-5 text-purple-600" />
          <div>
            <p className="font-medium text-gray-800">ECG Monitoring Active</p>
            <p className="text-xs text-gray-500">Patient is on continuous cardiac monitoring</p>
          </div>
        </label>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes / Findings</label>
          <textarea rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="e.g. Sinus rhythm, rate 80/min. No ST changes…" />
        </div>
      </div>
    </FormShell>
  )
}
