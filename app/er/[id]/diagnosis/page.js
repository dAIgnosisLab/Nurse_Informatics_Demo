'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import FormShell from '@/components/forms/FormShell'

export default function DiagnosisPage() {
  const { id } = useParams()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [diagnosisText, setDiagnosisText] = useState('')

  async function handleSave() {
    if (!diagnosisText.trim()) { setError('Diagnosis is required.'); return }
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/patients/${id}/provisional-diagnosis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diagnosisText }),
      })
      if (!res.ok) throw new Error('Failed to save')
      router.push(`/er/${id}`)
    } catch (e) {
      setError(e.message)
      setSaving(false)
    }
  }

  return (
    <FormShell title="Provisional Diagnosis" backHref={`/er/${id}/investigations`} backLabel="Investigations" onSave={handleSave} saving={saving} saveLabel="Save & View Summary →">
      {error && <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Provisional Diagnosis *</label>
        <textarea
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={diagnosisText}
          onChange={(e) => setDiagnosisText(e.target.value)}
          placeholder="Enter provisional diagnosis…"
        />
      </div>
    </FormShell>
  )
}
