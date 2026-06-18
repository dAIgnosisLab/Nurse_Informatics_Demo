'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'

export default function CardexClient({ patientId, initialRows }) {
  const router = useRouter()
  const dept = usePathname().startsWith('/icu/') ? 'icu' : 'ipd'
  const [rows, setRows] = useState(initialRows)
  const [showAdd, setShowAdd] = useState(false)

  function AddForm() {
    const [form, setForm] = useState({ doctorOrders: 'Continue current medications. Monitor vitals every 4 hours. Encourage oral fluids.', medicationsPrescribed: 'Tab. Paracetamol 500mg TDS\nInj. Amoxicillin 1g IV BD', proceduresToDo: 'IV cannula care. Wound dressing if required.', ivFluidsInstructions: 'NS 0.9% 500mL @ 80mL/hr', specialInstructions: 'Bed rest. Monitor urine output hourly.', nurseInitials: 'RN' })
    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
    const [saving, setSaving] = useState(false)

    async function submit() {
      setSaving(true)
      const res = await fetch(`/api/patients/${patientId}/treatment-cardex`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
      if (res.ok) { const r = await res.json(); setRows((prev) => [r, ...prev]); setShowAdd(false); router.refresh() }
      setSaving(false)
    }

    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-3">
        {[['Doctor Orders', 'doctorOrders'], ['Medications Prescribed', 'medicationsPrescribed'], ['Procedures To Do', 'proceduresToDo'], ['IV Fluids Instructions', 'ivFluidsInstructions'], ['Special Instructions', 'specialInstructions']].map(([label, key]) => (
          <div key={key}>
            <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
            <textarea rows={2} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={form[key]} onChange={(e) => set(key, e.target.value)} />
          </div>
        ))}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Nurse Initials</label>
          <input className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={form.nurseInitials} onChange={(e) => set('nurseInitials', e.target.value)} />
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={() => setShowAdd(false)} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded">Cancel</button>
          <button onClick={submit} disabled={saving} className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">{saving ? 'Saving…' : 'Save Entry'}</button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <Link href={`/${dept}/${patientId}`} className="inline-flex min-h-11 items-center rounded-xl border border-sky-100 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-sky-50">← Patient Dashboard</Link>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">+ Add Entry</button>
      </div>
      <h2 className="text-xl font-bold text-gray-900">Treatment Cardex</h2>
      {showAdd && <AddForm />}
      {rows.length === 0 ? <p className="text-center py-8 text-gray-400">No cardex entries yet.</p> : (
        <div className="space-y-3">
          {rows.map((entry) => (
            <div key={entry.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-500">{format(new Date(entry.date), 'dd MMM yyyy HH:mm')}</span>
                {entry.nurseInitials && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">{entry.nurseInitials}</span>}
              </div>
              <div className="space-y-1.5 text-sm">
                {entry.doctorOrders && <Row label="Doctor Orders" value={entry.doctorOrders} />}
                {entry.medicationsPrescribed && <Row label="Medications" value={entry.medicationsPrescribed} />}
                {entry.proceduresToDo && <Row label="Procedures" value={entry.proceduresToDo} />}
                {entry.ivFluidsInstructions && <Row label="IV Fluids" value={entry.ivFluidsInstructions} />}
                {entry.specialInstructions && <Row label="Special Instructions" value={entry.specialInstructions} />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Row({ label, value }) {
  return <div><span className="text-gray-500 font-medium">{label}: </span><span className="text-gray-800">{value}</span></div>
}
