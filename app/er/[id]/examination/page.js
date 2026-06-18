'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import FormShell from '@/components/forms/FormShell'

const systems = [
  { key: 'airway', label: 'Airway' },
  { key: 'breathing', label: 'Breathing' },
  { key: 'circulation', label: 'Circulation' },
  { key: 'pupils', label: 'Pupils' },
  { key: 'abdomen', label: 'Abdomen' },
]

export default function ExaminationPage() {
  const { id } = useParams()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState(
    Object.fromEntries(systems.flatMap((s) => [[`${s.key}Status`, 'Normal'], [`${s.key}Notes`, '']]))
  )
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/patients/${id}/examination`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to save')
      router.push(`/er/${id}/clinical-details`)
    } catch (e) {
      setError(e.message)
      setSaving(false)
    }
  }

  return (
    <FormShell title="Physical Examination" backHref={`/er/${id}/vitals`} backLabel="Vitals" onSave={handleSave} saving={saving} saveLabel="Save & Continue →">
      {error && <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
      <div className="space-y-4">
        {systems.map((s) => (
          <div key={s.key} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-700">{s.label}</span>
              <div className="flex gap-2">
                {['Normal', 'Abnormal'].map((v) => (
                  <button
                    key={v}
                    onClick={() => set(`${s.key}Status`, v)}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      form[`${s.key}Status`] === v
                        ? v === 'Normal' ? 'bg-green-100 border-green-400 text-green-700 font-medium' : 'bg-red-100 border-red-400 text-red-700 font-medium'
                        : 'border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            {form[`${s.key}Status`] === 'Abnormal' && (
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                rows={2}
                placeholder="Describe findings…"
                value={form[`${s.key}Notes`]}
                onChange={(e) => set(`${s.key}Notes`, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
    </FormShell>
  )
}
