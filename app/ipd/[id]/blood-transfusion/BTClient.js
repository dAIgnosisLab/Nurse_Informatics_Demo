'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import LogTable from '@/components/LogTable'

const columns = [
  { key: 'bloodGroup', label: 'Blood Group' },
  { key: 'unitNumber', label: 'Unit #' },
  { key: 'startTime', label: 'Start', isDate: true },
  { key: 'endTime', label: 'End', isDate: true },
  { key: 'reactionNotes', label: 'Reaction' },
]

export default function BTClient({ patientId, initialRows }) {
  const router = useRouter()
  const [rows, setRows] = useState(initialRows)

  function AddForm({ onClose }) {
    const [form, setForm] = useState({ bloodGroup: 'A+', unitNumber: 'U001', startTime: '', endTime: '', reactionNotes: 'None' })
    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
    const [saving, setSaving] = useState(false)

    async function submit() {
      if (!form.bloodGroup || !form.unitNumber || !form.startTime) return
      setSaving(true)
      const body = { bloodGroup: form.bloodGroup, unitNumber: form.unitNumber, startTime: form.startTime }
      if (form.endTime) body.endTime = form.endTime
      if (form.reactionNotes) body.reactionNotes = form.reactionNotes
      const res = await fetch(`/api/patients/${patientId}/blood-transfusion`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      })
      if (res.ok) { const r = await res.json(); setRows((prev) => [r, ...prev]); onClose(); router.refresh() }
      setSaving(false)
    }

    return (
      <div className="grid grid-cols-2 gap-3">
        {[['Blood Group *', 'bloodGroup', 'text'], ['Unit Number *', 'unitNumber', 'text'], ['Start Time *', 'startTime', 'datetime-local'], ['End Time', 'endTime', 'datetime-local']].map(([label, key, type]) => (
          <div key={key}>
            <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
            <input type={type} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={form[key]} onChange={(e) => set(key, e.target.value)} />
          </div>
        ))}
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">Reaction Notes</label>
          <input className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={form.reactionNotes} onChange={(e) => set('reactionNotes', e.target.value)} placeholder="None" />
        </div>
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
      <LogTable title="Blood Transfusion Records" columns={columns} rows={rows} addForm={(onClose) => <AddForm onClose={onClose} />} emptyMessage="No transfusions recorded." />
    </div>
  )
}
