'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import FormShell from '@/components/forms/FormShell'

export default function ClinicalDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ chiefComplaints: '', pastHistory: '', drugAllergyHistory: '', personalHistory: '' })
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  async function handleSave() {
    if (!form.chiefComplaints) { setError('Chief complaints are required.'); return }
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/patients/${id}/clinical-details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to save')
      router.push(`/er/${id}/investigations`)
    } catch (e) {
      setError(e.message)
      setSaving(false)
    }
  }

  const textArea = (label, key, placeholder, required = false) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}{required && ' *'}</label>
      <textarea
        rows={3}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )

  return (
    <FormShell title="Clinical Details" backHref={`/er/${id}/examination`} backLabel="Examination" onSave={handleSave} saving={saving} saveLabel="Save & Continue →">
      {error && <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
      <div className="space-y-4">
        {textArea('Chief Complaints', 'chiefComplaints', 'e.g. Chest pain, shortness of breath…', true)}
        {textArea('Past Medical History', 'pastHistory', 'Previous illnesses, surgeries, hospitalisations…')}
        {textArea('Drug / Allergy History', 'drugAllergyHistory', 'Known drug allergies or adverse reactions…')}
        {textArea('Personal & Social History', 'personalHistory', 'Smoking, alcohol, occupation…')}
      </div>
    </FormShell>
  )
}
