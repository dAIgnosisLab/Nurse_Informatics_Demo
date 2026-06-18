'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import LogTable from '@/components/LogTable'

const columns = [
  { key: 'fluidType', label: 'Fluid' },
  { key: 'rate', label: 'Rate' },
  { key: 'startTime', label: 'Start', isDate: true },
  { key: 'endTime', label: 'End', isDate: true },
  { key: 'volumeInfused', label: 'Volume (mL)' },
]

export default function IVFluidsClient({ patientId, initialRows }) {
  const router = useRouter()
  const dept = usePathname().startsWith('/icu/') ? 'icu' : 'ipd'
  const [rows, setRows] = useState(initialRows)

  function AddForm({ onClose }) {
    const [form, setForm] = useState({ fluidType: 'Normal Saline 0.9%', rate: '80 mL/hr', startTime: '', endTime: '', volumeInfused: '500' })
    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
    const [saving, setSaving] = useState(false)

    async function submit() {
      if (!form.fluidType || !form.rate || !form.startTime) return
      setSaving(true)
      const body = { fluidType: form.fluidType, rate: form.rate, startTime: form.startTime }
      if (form.endTime) body.endTime = form.endTime
      if (form.volumeInfused) body.volumeInfused = parseFloat(form.volumeInfused)
      const res = await fetch(`/api/patients/${patientId}/iv-fluids`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      })
      if (res.ok) { const r = await res.json(); setRows((prev) => [r, ...prev]); onClose(); router.refresh() }
      setSaving(false)
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[['Fluid Type *', 'fluidType', 'text'], ['Rate *', 'rate', 'text'], ['Start Time *', 'startTime', 'datetime-local'], ['End Time', 'endTime', 'datetime-local'], ['Volume Infused (mL)', 'volumeInfused', 'number']].map(([label, key, type]) => (
          <div key={key}>
            <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
            <input type={type} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={form[key]} onChange={(e) => set(key, e.target.value)} />
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
      <Link href={`/${dept}/${patientId}`} className="mb-4 inline-flex min-h-11 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50">← Patient Dashboard</Link>
      <LogTable title="IV Fluids" columns={columns} rows={rows} addForm={(onClose) => <AddForm onClose={onClose} />} emptyMessage="No IV fluids recorded." />
    </div>
  )
}
