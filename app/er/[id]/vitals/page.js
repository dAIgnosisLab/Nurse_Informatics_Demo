'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import FormShell from '@/components/forms/FormShell'

export default function ERVitalsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ temperature: '37.2', pulse: '82', respiration: '16', bp: '120/80', spo2: '98', gcs: '15' })
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const body = {}
      if (form.temperature) body.temperature = parseFloat(form.temperature)
      if (form.pulse) body.pulse = parseFloat(form.pulse)
      if (form.respiration) body.respiration = parseFloat(form.respiration)
      if (form.bp) body.bp = form.bp
      if (form.spo2) body.spo2 = parseFloat(form.spo2)
      if (form.gcs) body.gcs = parseFloat(form.gcs)

      const res = await fetch(`/api/patients/${id}/er-vitals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Failed to save')
      router.push(`/er/${id}`)
    } catch (e) {
      setError(e.message)
      setSaving(false)
    }
  }

  const field = (label, key, placeholder, type = 'number') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )

  return (
    <FormShell title="Initial Vitals" backHref={`/er/${id}/triage`} backLabel="Triage" cancelHref={`/er/${id}`} onSave={handleSave} saving={saving} saveLabel="Save & Continue →">
      {error && <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
      <div className="grid grid-cols-2 gap-4">
        {field('Temperature (°C)', 'temperature', '37.0')}
        {field('Pulse (bpm)', 'pulse', '80')}
        {field('Respiration (breaths/min)', 'respiration', '16')}
        {field('Blood Pressure (mmHg)', 'bp', '120/80', 'text')}
        {field('SpO₂ (%)', 'spo2', '98')}
        {field('GCS Score', 'gcs', '15')}
      </div>
    </FormShell>
  )
}
