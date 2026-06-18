'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import LogTable from '@/components/LogTable'

const columns = [
  { key: 'recordedAt', label: 'Time', isDate: true },
  { key: 'type', label: 'Type' },
  { key: 'subtype', label: 'Subtype' },
  { key: 'quantity', label: 'Qty (mL)' },
]

const SUBTYPES = {
  Intake: ['OralFluid', 'IVFluid', 'TubeFeeding'],
  Output: ['Urine', 'Vomit', 'Stool', 'Drainage'],
}

export default function IOLogClient({ patientId, initialRows }) {
  const router = useRouter()
  const [rows, setRows] = useState(initialRows)

  const totalIn = rows.filter((r) => r.type === 'Intake').reduce((s, r) => s + r.quantity, 0)
  const totalOut = rows.filter((r) => r.type === 'Output').reduce((s, r) => s + r.quantity, 0)

  function AddForm({ onClose }) {
    const [form, setForm] = useState({ type: 'Intake', subtype: 'OralFluid', quantity: '200' })
    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
    const [saving, setSaving] = useState(false)

    async function submit() {
      if (!form.quantity) return
      setSaving(true)
      const res = await fetch(`/api/patients/${patientId}/intake-output`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: form.type, subtype: form.subtype, quantity: parseFloat(form.quantity) }),
      })
      if (res.ok) {
        const newRow = await res.json()
        setRows((r) => [newRow, ...r])
        onClose(); router.refresh()
      }
      setSaving(false)
    }

    return (
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
          <select className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={form.type} onChange={(e) => set('type', e.target.value)}>
            <option>Intake</option><option>Output</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Subtype</label>
          <select className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={form.subtype} onChange={(e) => set('subtype', e.target.value)}>
            {SUBTYPES[form.type].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Quantity (mL) *</label>
          <input type="number" className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={form.quantity} onChange={(e) => set('quantity', e.target.value)} />
        </div>
        <div className="col-span-3 flex justify-end gap-2 pt-1">
          <button onClick={onClose} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded">Cancel</button>
          <button onClick={submit} disabled={saving} className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">{saving ? 'Saving…' : 'Add'}</button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <Link href={`/ipd/${patientId}`} className="mb-4 inline-flex min-h-11 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50">← Patient Dashboard</Link>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 text-center">
          <p className="text-xs text-blue-500 font-medium">Total Intake</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{totalIn} mL</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 text-center">
          <p className="text-xs text-amber-500 font-medium">Total Output</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">{totalOut} mL</p>
        </div>
        <div className={`rounded-xl border p-4 text-center ${totalIn - totalOut >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <p className="text-xs text-gray-500 font-medium">Balance</p>
          <p className={`text-2xl font-bold mt-1 ${totalIn - totalOut >= 0 ? 'text-green-700' : 'text-red-700'}`}>{totalIn - totalOut} mL</p>
        </div>
      </div>
      <LogTable title="Intake / Output Log" columns={columns} rows={rows} addForm={(onClose) => <AddForm onClose={onClose} />} emptyMessage="No entries recorded." />
    </div>
  )
}
