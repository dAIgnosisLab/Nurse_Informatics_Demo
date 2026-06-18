'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'

const ACTIVITIES = ['BedRest', 'Sitting', 'Walking', 'AssistedMovement']
const activityColors = {
  BedRest: 'bg-red-100 text-red-700',
  Sitting: 'bg-yellow-100 text-yellow-700',
  Walking: 'bg-green-100 text-green-700',
  AssistedMovement: 'bg-blue-100 text-blue-700',
}

export default function ActivityClient({ patientId, initialRows }) {
  const router = useRouter()
  const [rows, setRows] = useState(initialRows)
  const [selected, setSelected] = useState('')
  const [saving, setSaving] = useState(false)

  async function submit() {
    if (!selected) return
    setSaving(true)
    const res = await fetch(`/api/patients/${patientId}/activity`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ activityType: selected }),
    })
    if (res.ok) { const r = await res.json(); setRows((prev) => [r, ...prev]); setSelected(''); router.refresh() }
    setSaving(false)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
      <Link href={`/ipd/${patientId}`} className="text-sm text-blue-600 hover:underline block">← Patient Dashboard</Link>
      <h2 className="text-xl font-bold text-gray-900">Activity Log</h2>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <p className="text-sm font-medium text-gray-700 mb-3">Record Current Activity</p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {ACTIVITIES.map((a) => (
            <button key={a} onClick={() => setSelected(a)} className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${selected === a ? `${activityColors[a]} border-current` : 'border-gray-200 hover:bg-gray-50'}`}>
              {a}
            </button>
          ))}
        </div>
        <div className="flex justify-end">
          <button onClick={submit} disabled={!selected || saving} className="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors">
            {saving ? 'Saving…' : 'Log Activity'}
          </button>
        </div>
      </div>

      {rows.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <h3 className="font-semibold text-gray-700">Activity History</h3>
          </div>
          <ul className="divide-y divide-gray-100">
            {rows.map((r) => (
              <li key={r.id} className="flex items-center justify-between px-5 py-3">
                <span className={`text-sm px-2.5 py-0.5 rounded-full font-medium ${activityColors[r.activityType]}`}>{r.activityType}</span>
                <span className="text-xs text-gray-400">{format(new Date(r.recordedAt), 'dd MMM HH:mm')}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
