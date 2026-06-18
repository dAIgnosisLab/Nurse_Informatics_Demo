'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import LogTable from '@/components/LogTable'

const columns = [
  { key: 'drugName', label: 'Drug' },
  { key: 'dose', label: 'Dose' },
  { key: 'route', label: 'Route' },
  { key: 'timeScheduled', label: 'Scheduled' },
  { key: 'timeGiven', label: 'Given', render: (v) => v ?? <span className="text-amber-600 font-medium">Pending</span> },
  { key: 'nurseSignature', label: 'Nurse' },
]

export default function MedLogClient({ patientId, initialRows }) {
  const router = useRouter()
  const [rows, setRows] = useState(initialRows)
  const pending = rows.filter((r) => !r.timeGiven).length

  function AddForm({ onClose }) {
    const [form, setForm] = useState({ drugName: 'Paracetamol', dose: '500mg', route: 'Oral', timeScheduled: '08:00', timeGiven: '', nurseSignature: 'RN' })
    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
    const [saving, setSaving] = useState(false)

    async function submit() {
      if (!form.drugName || !form.dose || !form.timeScheduled) return
      setSaving(true)
      const res = await fetch(`/api/patients/${patientId}/medications`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, timeGiven: form.timeGiven || null }),
      })
      if (res.ok) { const r = await res.json(); setRows((prev) => [r, ...prev]); onClose(); router.refresh() }
      setSaving(false)
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[['Drug Name *', 'drugName'], ['Dose *', 'dose'], ['Route', 'route'], ['Time Scheduled *', 'timeScheduled'], ['Time Given', 'timeGiven'], ['Nurse Signature', 'nurseSignature']].map(([label, key]) => (
          <div key={key}>
            <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
            <input className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={form[key]} onChange={(e) => set(key, e.target.value)} />
          </div>
        ))}
        <div className="col-span-2 md:col-span-3 flex justify-end gap-2 pt-1">
          <button onClick={onClose} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded">Cancel</button>
          <button onClick={submit} disabled={saving} className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">{saving ? 'Saving…' : 'Add'}</button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <Link href={`/ipd/${patientId}`} className="mb-4 inline-flex min-h-11 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50">← Patient Dashboard</Link>
      {pending > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
          <strong>{pending} medication{pending > 1 ? 's' : ''}</strong> pending administration
        </div>
      )}
      <LogTable title="Medication Administration" columns={columns} rows={rows} addForm={(onClose) => <AddForm onClose={onClose} />} emptyMessage="No medications recorded." />
    </div>
  )
}
