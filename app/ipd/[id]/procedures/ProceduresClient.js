'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import LogTable from '@/components/LogTable'

const columns = [
  { key: 'procedureName', label: 'Procedure' },
  { key: 'dateTime', label: 'Date/Time', isDate: true },
  { key: 'performedBy', label: 'Performed By' },
  { key: 'remarks', label: 'Remarks' },
]

export default function ProceduresClient({ patientId, initialRows }) {
  const router = useRouter()
  const [rows, setRows] = useState(initialRows)

  function AddForm({ onClose }) {
    const [form, setForm] = useState({ procedureName: 'IV Cannula Insertion', dateTime: '', performedBy: 'Dr. Sharma', remarks: 'Successful, no complications' })
    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
    const [saving, setSaving] = useState(false)

    async function submit() {
      if (!form.procedureName || !form.performedBy) return
      setSaving(true)
      const res = await fetch(`/api/patients/${patientId}/procedures`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
      if (res.ok) { const r = await res.json(); setRows((prev) => [r, ...prev]); onClose(); router.refresh() }
      setSaving(false)
    }

    return (
      <div className="grid grid-cols-2 gap-3">
        {[['Procedure Name *', 'procedureName', 'text'], ['Date/Time', 'dateTime', 'datetime-local'], ['Performed By *', 'performedBy', 'text'], ['Remarks', 'remarks', 'text']].map(([label, key, type]) => (
          <div key={key}>
            <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
            <input type={type} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={form[key]} onChange={(e) => set(key, e.target.value)} />
          </div>
        ))}
        <div className="col-span-2 flex justify-end gap-2 pt-1">
          <button onClick={onClose} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded">Cancel</button>
          <button onClick={submit} disabled={saving} className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">{saving ? 'Saving…' : 'Add'}</button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <Link href={`/ipd/${patientId}`} className="mb-4 inline-flex min-h-11 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50">← Patient Dashboard</Link>
      <LogTable title="Procedure Records" columns={columns} rows={rows} addForm={(onClose) => <AddForm onClose={onClose} />} emptyMessage="No procedures recorded." />
    </div>
  )
}
