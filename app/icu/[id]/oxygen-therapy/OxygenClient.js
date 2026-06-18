'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import FormShell from '@/components/forms/FormShell'

const DELIVERY_METHODS = ['Nasal Cannula', 'Simple Face Mask', 'Non-Rebreather Mask', 'Venturi Mask', 'High Flow Nasal Cannula', 'Endotracheal Tube', 'Tracheostomy']

export default function OxygenClient({ patientId, existing }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ flowRate: existing?.flowRate ?? '', deliveryMethod: existing?.deliveryMethod ?? '' })
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  async function handleSave() {
    if (!form.flowRate || !form.deliveryMethod) { setError('Flow rate and delivery method are required.'); return }
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/patients/${patientId}/oxygen-therapy`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to save')
      router.push(`/icu/${patientId}`)
    } catch (e) {
      setError(e.message); setSaving(false)
    }
  }

  return (
    <FormShell title="Oxygen Therapy" backHref={`/icu/${patientId}`} backLabel="ICU Dashboard" onSave={handleSave} saving={saving}>
      {error && <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Flow Rate *</label>
          <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.flowRate} onChange={(e) => set('flowRate', e.target.value)} placeholder="e.g. 4 L/min or 40% FiO₂" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Method *</label>
          <div className="grid grid-cols-1 gap-2">
            {DELIVERY_METHODS.map((m) => (
              <button key={m} onClick={() => set('deliveryMethod', m)} className={`text-left px-3 py-2 rounded-lg border text-sm transition-colors ${form.deliveryMethod === m ? 'border-purple-400 bg-purple-50 text-purple-700 font-medium' : 'border-gray-200 hover:bg-gray-50'}`}>
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>
    </FormShell>
  )
}
