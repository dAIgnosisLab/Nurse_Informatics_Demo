'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import FormShell from '@/components/forms/FormShell'

const codes = [
  { code: 'Red', label: 'Red — Immediate', desc: 'Life-threatening, requires immediate attention', bg: 'bg-red-100 border-red-400', text: 'text-red-700' },
  { code: 'Yellow', label: 'Yellow — Urgent', desc: 'Serious but stable, can wait briefly', bg: 'bg-yellow-100 border-yellow-400', text: 'text-yellow-700' },
  { code: 'Green', label: 'Green — Non-Urgent', desc: 'Minor, can wait for treatment', bg: 'bg-green-100 border-green-400', text: 'text-green-700' },
]

export default function TriagePage() {
  const { id } = useParams()
  const router = useRouter()
  const [selected, setSelected] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    if (!selected) { setError('Please select a triage code.'); return }
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/patients/${id}/triage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ triageCode: selected }),
      })
      if (!res.ok) throw new Error('Failed to save')
      router.push(`/er/${id}/vitals`)
    } catch (e) {
      setError(e.message)
      setSaving(false)
    }
  }

  return (
    <FormShell title="Triage Assessment" backHref={`/er/${id}`} backLabel="Patient Summary" cancelHref={`/er/${id}/vitals`} onSave={handleSave} saving={saving} saveLabel="Save & Continue →">
      {error && <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
      <div className="space-y-3">
        <p className="text-sm text-gray-600 mb-4">Select the triage priority code for this patient:</p>
        {codes.map((c) => (
          <button
            key={c.code}
            onClick={() => setSelected(c.code)}
            className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
              selected === c.code ? `${c.bg} ${c.text} shadow-sm` : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-bold text-base">{c.label}</div>
            <div className="text-sm mt-0.5 opacity-80">{c.desc}</div>
          </button>
        ))}
      </div>
    </FormShell>
  )
}
