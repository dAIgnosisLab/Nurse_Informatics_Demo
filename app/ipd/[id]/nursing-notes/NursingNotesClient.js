'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'

const shiftColors = { Morning: 'bg-yellow-100 text-yellow-700', Evening: 'bg-orange-100 text-orange-700', Night: 'bg-blue-100 text-blue-700' }

export default function NursingNotesClient({ patientId, initialRows }) {
  const router = useRouter()
  const [rows, setRows] = useState(initialRows)
  const [showAdd, setShowAdd] = useState(false)

  function AddForm() {
    const [form, setForm] = useState({ shift: 'Morning', observations: 'Patient is conscious and oriented. Vital signs stable. No complaints of distress.', interventions: 'Medications administered as prescribed. IV site checked and patent.', patientResponse: 'Patient tolerated interventions well. Resting comfortably.', nurseName: 'Anita Rai' })
    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
    const [saving, setSaving] = useState(false)

    async function submit() {
      if (!form.observations || !form.nurseName) return
      setSaving(true)
      const res = await fetch(`/api/patients/${patientId}/nursing-notes`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
      if (res.ok) { const r = await res.json(); setRows((prev) => [r, ...prev]); setShowAdd(false); router.refresh() }
      setSaving(false)
    }

    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-gray-700">New Nursing Note</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Shift</label>
            <select className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={form.shift} onChange={(e) => set('shift', e.target.value)}>
              <option>Morning</option><option>Evening</option><option>Night</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Nurse Name *</label>
            <input className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={form.nurseName} onChange={(e) => set('nurseName', e.target.value)} />
          </div>
        </div>
        {[['Observations *', 'observations'], ['Interventions', 'interventions'], ['Patient Response', 'patientResponse']].map(([label, key]) => (
          <div key={key}>
            <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
            <textarea rows={2} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={form[key]} onChange={(e) => set(key, e.target.value)} />
          </div>
        ))}
        <div className="flex justify-end gap-2">
          <button onClick={() => setShowAdd(false)} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded">Cancel</button>
          <button onClick={submit} disabled={saving} className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">{saving ? 'Saving…' : 'Add Note'}</button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <Link href={`/ipd/${patientId}`} className="inline-flex min-h-11 items-center rounded-xl border border-sky-100 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-sky-50">← Patient Dashboard</Link>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">+ Add Note</button>
      </div>
      <h2 className="text-xl font-bold text-gray-900">Nursing Notes</h2>

      {showAdd && <AddForm />}

      {rows.length === 0 ? (
        <p className="text-center py-8 text-gray-400">No nursing notes yet.</p>
      ) : (
        <div className="space-y-3">
          {rows.map((note) => (
            <div key={note.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${shiftColors[note.shift]}`}>{note.shift}</span>
                  <span className="text-sm font-medium text-gray-700">{note.nurseName}</span>
                </div>
                <span className="text-xs text-gray-400">{format(new Date(note.recordedAt), 'dd MMM yyyy HH:mm')}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-500 font-medium">Observations: </span><span className="text-gray-800">{note.observations}</span></div>
                {note.interventions && <div><span className="text-gray-500 font-medium">Interventions: </span><span className="text-gray-800">{note.interventions}</span></div>}
                {note.patientResponse && <div><span className="text-gray-500 font-medium">Patient Response: </span><span className="text-gray-800">{note.patientResponse}</span></div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
