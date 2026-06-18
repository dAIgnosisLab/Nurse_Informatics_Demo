'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import FormShell from '@/components/forms/FormShell'

const destinations = [
  { value: 'ER', label: 'ER — Emergency Room', icon: '🚨' },
  { value: 'ICU', label: 'ICU — Intensive Care Unit', icon: '💊' },
]

export default function IPDTransferPage() {
  const { id } = useParams()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [confirm, setConfirm] = useState(false)
  const [dest, setDest] = useState('')
  const [bedNumber, setBedNumber] = useState('')
  const [ward, setWard] = useState('')
  const [notes, setNotes] = useState('')

  async function handleSave() {
    if (!dest) { setError('Please select a destination.'); return }
    if (!confirm) { setError('Please confirm this transfer.'); return }
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/patients/${id}/transfer`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toDepartment: dest, bedNumber: bedNumber || undefined, ward: ward || undefined, notes: notes || undefined }),
      })
      if (!res.ok) throw new Error('Transfer failed')
      router.push(`/${dest.toLowerCase()}/${id}`)
    } catch (e) {
      setError(e.message); setSaving(false)
    }
  }

  return (
    <FormShell title="Transfer Patient" backHref={`/ipd/${id}`} backLabel="Patient Dashboard" onSave={handleSave} saving={saving} saveLabel="Confirm Transfer →">
      {error && <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
      <div className="space-y-4">
        <p className="text-sm text-gray-600">Select destination department:</p>
        {destinations.map((d) => (
          <button key={d.value} onClick={() => setDest(d.value)} className={`w-full text-left border-2 rounded-xl p-4 transition-all ${dest === d.value ? 'border-purple-400 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}>
            <span className="text-lg mr-2">{d.icon}</span>
            <span className="font-medium">{d.label}</span>
          </button>
        ))}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bed Number</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={bedNumber} onChange={(e) => setBedNumber(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ward</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={ward} onChange={(e) => setWard(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Transfer Notes</label>
          <textarea rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} className="w-4 h-4" />
          <span className="text-sm text-gray-700">I confirm this transfer is correct</span>
        </label>
      </div>
    </FormShell>
  )
}
