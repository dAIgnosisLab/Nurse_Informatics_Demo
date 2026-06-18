'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import FormShell from '@/components/forms/FormShell'

export default function AdmitIPDPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: 'Ram Bahadur Thapa', age: '45', sex: 'Male', diagnosis: 'Community Acquired Pneumonia', bedNumber: 'B12', ward: 'General', ipNumber: 'IPD-001' })
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  async function handleSave() {
    if (!form.name || !form.age) { setError('Name and age are required.'); return }
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, age: parseInt(form.age), sex: form.sex,
          department: 'IPD', status: 'Admitted',
          diagnosis: form.diagnosis || undefined,
          bedNumber: form.bedNumber || undefined,
          ward: form.ward || undefined,
          ipNumber: form.ipNumber || undefined,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      const patient = await res.json()
      router.push(`/ipd/${patient.id}`)
    } catch (e) {
      setError(e.message)
      setSaving(false)
    }
  }

  return (
    <FormShell title="Admit Patient to IPD" backHref="/ipd" backLabel="IPD Dashboard" onSave={handleSave} saving={saving} saveLabel="Admit Patient">
      {error && <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name *</label>
          <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Full name" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
            <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.age} onChange={(e) => set('age', e.target.value)} placeholder="Years" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.sex} onChange={(e) => set('sex', e.target.value)}>
              <option>Male</option><option>Female</option><option>Other</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
          <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.diagnosis} onChange={(e) => set('diagnosis', e.target.value)} placeholder="Primary diagnosis" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">IP Number</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.ipNumber} onChange={(e) => set('ipNumber', e.target.value)} placeholder="IPD-001" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bed No.</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.bedNumber} onChange={(e) => set('bedNumber', e.target.value)} placeholder="B12" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ward</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.ward} onChange={(e) => set('ward', e.target.value)} placeholder="General" />
          </div>
        </div>
      </div>
    </FormShell>
  )
}
