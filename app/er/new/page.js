'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import FormShell from '@/components/forms/FormShell'

export default function NewERPatient() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', age: '', sex: 'Male',
    broughtBy: '', relation: '',
  })

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  async function handleSave() {
    if (!form.name || !form.age || !form.broughtBy || !form.relation) {
      setError('Please fill all required fields.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const patRes = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, age: parseInt(form.age), sex: form.sex, department: 'ER' }),
      })
      if (!patRes.ok) throw new Error('Failed to create patient')
      const patient = await patRes.json()

      await fetch(`/api/patients/${patient.id}/er-intake`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ broughtBy: form.broughtBy, relation: form.relation }),
      })

      router.push(`/er/${patient.id}/triage`)
    } catch (e) {
      setError(e.message)
      setSaving(false)
    }
  }

  return (
    <FormShell title="New Patient Intake" backHref="/er" backLabel="ER Dashboard" onSave={handleSave} saving={saving} saveLabel="Register & Triage →">
      {error && <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name *</label>
          <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Full name" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
            <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.age} onChange={(e) => set('age', e.target.value)} placeholder="Years" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sex *</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.sex} onChange={(e) => set('sex', e.target.value)}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-4">
          <p className="text-sm font-semibold text-gray-600 mb-3">Arrival Information</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brought By *</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.broughtBy} onChange={(e) => set('broughtBy', e.target.value)} placeholder="Name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Relation *</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.relation} onChange={(e) => set('relation', e.target.value)} placeholder="e.g. Father, Friend" />
            </div>
          </div>
        </div>
      </div>
    </FormShell>
  )
}
