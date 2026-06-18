'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import FormShell from '@/components/forms/FormShell'

const MODES = ['IPPV', 'SIMV', 'CPAP', 'BiPAP', 'Pressure Control', 'Volume Control', 'Other']

export default function VentilatorClient({ patientId, existing }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ inUse: existing?.inUse ?? true, mode: existing?.mode ?? 'SIMV', settings: existing?.settings ?? 'FiO₂ 40%, Tidal Volume 500mL, PEEP 5cmH₂O, RR 14' })
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/patients/${patientId}/ventilator`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to save')
      router.push(`/icu/${patientId}`)
    } catch (e) {
      setError(e.message); setSaving(false)
    }
  }

  return (
    <FormShell title="Ventilator Support" backHref={`/icu/${patientId}`} backLabel="ICU Dashboard" onSave={handleSave} saving={saving}>
      {error && <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
      <div className="space-y-5">
        <label className="flex items-center gap-3 cursor-pointer p-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50">
          <input type="checkbox" checked={form.inUse} onChange={(e) => set('inUse', e.target.checked)} className="w-5 h-5 text-purple-600" />
          <div>
            <p className="font-medium text-gray-800">Ventilator In Use</p>
            <p className="text-xs text-gray-500">Check if patient is on mechanical ventilation</p>
          </div>
        </label>
        {form.inUse && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ventilation Mode</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.mode} onChange={(e) => set('mode', e.target.value)}>
                <option value="">Select mode…</option>
                {MODES.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Settings / Parameters</label>
              <textarea rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.settings} onChange={(e) => set('settings', e.target.value)} placeholder="e.g. FiO₂ 40%, Tidal Volume 500mL, PEEP 5cmH₂O, RR 14…" />
            </div>
          </>
        )}
      </div>
    </FormShell>
  )
}
