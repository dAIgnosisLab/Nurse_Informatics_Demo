'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import LogTable from '@/components/LogTable'

const columns = [
  { key: 'recordedAt', label: 'Time', isDate: true },
  { key: 'bp', label: 'BP' },
  { key: 'pulse', label: 'HR' },
  { key: 'respiration', label: 'RR' },
  { key: 'spo2', label: 'SpO₂ (%)' },
  { key: 'temperature', label: 'Temp (°C)' },
  { key: 'nurseName', label: 'Nurse' },
]

export default function VitalsLogClient({ patientId, initialRows }) {
  const router = useRouter()
  const [rows, setRows] = useState(initialRows)

  function AddForm({ onClose }) {
    const [form, setForm] = useState({ bp: '', pulse: '', respiration: '', spo2: '', temperature: '', nurseName: '' })
    const [saving, setSaving] = useState(false)
    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

    async function submit() {
      if (!form.nurseName) return
      setSaving(true)
      const body = { nurseName: form.nurseName }
      if (form.bp) body.bp = form.bp
      if (form.pulse) body.pulse = parseFloat(form.pulse)
      if (form.respiration) body.respiration = parseFloat(form.respiration)
      if (form.spo2) body.spo2 = parseFloat(form.spo2)
      if (form.temperature) body.temperature = parseFloat(form.temperature)

      const res = await fetch(`/api/patients/${patientId}/vitals`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      })
      if (res.ok) {
        const newRow = await res.json()
        setRows((r) => [newRow, ...r])
        onClose()
        router.refresh()
      }
      setSaving(false)
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[['BP (mmHg)', 'bp', 'text'], ['Pulse (bpm)', 'pulse', 'number'], ['Resp (breaths/min)', 'respiration', 'number'], ['SpO₂ (%)', 'spo2', 'number'], ['Temp (°C)', 'temperature', 'number']].map(([label, key, type]) => (
          <div key={key}>
            <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
            <input type={type} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={form[key]} onChange={(e) => set(key, e.target.value)} />
          </div>
        ))}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Nurse Name *</label>
          <input className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={form.nurseName} onChange={(e) => set('nurseName', e.target.value)} placeholder="Required" />
        </div>
        <div className="col-span-2 md:col-span-3 flex justify-end gap-2 pt-1">
          <button onClick={onClose} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded">Cancel</button>
          <button onClick={submit} disabled={saving} className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">{saving ? 'Saving…' : 'Add'}</button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Link href={`/ipd/${patientId}`} className="text-sm text-blue-600 hover:underline mb-4 block">← Patient Dashboard</Link>
      <LogTable title="Vital Signs Log" columns={columns} rows={rows} addForm={(onClose) => <AddForm onClose={onClose} />} emptyMessage="No vitals recorded yet." />
    </div>
  )
}
