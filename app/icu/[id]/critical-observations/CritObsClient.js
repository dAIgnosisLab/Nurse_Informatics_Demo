'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'

export default function CritObsClient({ patientId, initialRows }) {
  const router = useRouter()
  const [rows, setRows] = useState(initialRows)
  const [showAdd, setShowAdd] = useState(false)

  function AddForm() {
    const [form, setForm] = useState({ suddenChanges: 'Sudden drop in blood pressure noted. Patient became restless and diaphoretic.', emergencyInterventions: 'IV bolus 250mL NS given. Physician notified immediately. Vitals monitored every 15 min.', nurseName: 'Nurse Maya' })
    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
    const [saving, setSaving] = useState(false)

    async function submit() {
      if (!form.suddenChanges || !form.nurseName) return
      setSaving(true)
      const res = await fetch(`/api/patients/${patientId}/critical-observations`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
      if (res.ok) { const r = await res.json(); setRows((prev) => [r, ...prev]); setShowAdd(false); router.refresh() }
      setSaving(false)
    }

    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-5 space-y-4">
        <h3 className="font-bold text-red-700">New Critical Observation</h3>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Sudden Changes / Clinical Event *</label>
          <textarea rows={3} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={form.suddenChanges} onChange={(e) => set('suddenChanges', e.target.value)} placeholder="Describe the clinical change or event…" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Emergency Interventions</label>
          <textarea rows={2} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={form.emergencyInterventions} onChange={(e) => set('emergencyInterventions', e.target.value)} placeholder="What was done…" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Nurse Name *</label>
          <input className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={form.nurseName} onChange={(e) => set('nurseName', e.target.value)} />
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={() => setShowAdd(false)} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded">Cancel</button>
          <button onClick={submit} disabled={saving} className="px-4 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50">{saving ? 'Saving…' : 'Record'}</button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <Link href={`/icu/${patientId}`} className="inline-flex min-h-11 items-center rounded-xl border border-sky-100 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-sky-50">← ICU Dashboard</Link>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">+ Add Observation</button>
      </div>
      <h2 className="text-xl font-bold text-gray-900">Critical Observations</h2>

      {showAdd && <AddForm />}

      {rows.length === 0 ? (
        <p className="text-center py-8 text-gray-400">No critical observations recorded.</p>
      ) : (
        <div className="space-y-3">
          {rows.map((obs) => (
            <div key={obs.id} className="bg-white border border-red-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-red-700">{format(new Date(obs.recordedAt), 'dd MMM yyyy HH:mm')}</span>
                <span className="text-xs text-gray-500">By: {obs.nurseName}</span>
              </div>
              <p className="text-sm text-gray-800 font-medium mb-1">{obs.suddenChanges}</p>
              {obs.emergencyInterventions && (
                <p className="text-sm text-gray-600"><span className="font-medium text-gray-500">Interventions: </span>{obs.emergencyInterventions}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
