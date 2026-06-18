'use client'

import { useState } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import FormShell from '@/components/forms/FormShell'

const destinations = [
  { value: 'IPD', label: 'IPD — In-Patient Department', icon: '🏥' },
  { value: 'ICU', label: 'ICU — Intensive Care Unit', icon: '💊' },
]

export default function ERTransferPage() {
  const { id } = useParams()
  const searchParams = useSearchParams()
  const isDischarge = searchParams.get('discharge') === '1'
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [confirm, setConfirm] = useState(false)
  const [dest, setDest] = useState('')
  const [bedNumber, setBedNumber] = useState('')
  const [ward, setWard] = useState('')
  const [notes, setNotes] = useState('')

  async function handleSave() {
    if (!isDischarge && !dest) { setError('Please select a destination department.'); return }
    if (!isDischarge && !bedNumber.trim()) { setError('Bed number is required.'); return }
    if (!isDischarge && dest === 'IPD' && !ward.trim()) { setError('Ward is required for IPD transfer.'); return }
    if (!confirm) { setError('Please confirm this action.'); return }

    setSaving(true)
    setError('')
    try {
      if (isDischarge) {
        await fetch(`/api/patients/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'Discharged' }),
        })
        router.push('/er')
      } else {
        const res = await fetch(`/api/patients/${id}/transfer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ toDepartment: dest, bedNumber: bedNumber || undefined, ward: ward || undefined, notes: notes || undefined }),
        })
        if (!res.ok) throw new Error('Transfer failed')
        router.push(`/${dest.toLowerCase()}/${id}`)
      }
    } catch (e) {
      setError(e.message)
      setSaving(false)
    }
  }

  return (
    <FormShell
      title={isDischarge ? 'Discharge from ER' : 'Transfer Patient'}
      backHref={`/er/${id}`}
      backLabel="Patient Summary"
      onSave={handleSave}
      saving={saving}
      saveLabel={isDischarge ? 'Confirm Discharge' : 'Confirm Transfer →'}
    >
      {error && <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

      {isDischarge ? (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-700">
            This will mark the patient as <strong>Discharged</strong> from the ER. This action cannot be easily undone.
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discharge Notes</label>
            <textarea rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes…" />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Select destination department:</p>
          {destinations.map((d) => (
            <button key={d.value} onClick={() => setDest(d.value)} className={`w-full text-left border-2 rounded-xl p-4 transition-all ${dest === d.value ? 'border-purple-400 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}>
              <span className="text-lg mr-2">{d.icon}</span>
              <span className="font-medium">{d.label}</span>
            </button>
          ))}
          <div className={`grid gap-4 pt-2 ${dest === 'ICU' ? 'grid-cols-1' : 'grid-cols-2'}`}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bed Number *</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={bedNumber} onChange={(e) => setBedNumber(e.target.value)} placeholder="e.g. B12" />
            </div>
            {dest !== 'ICU' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ward *</label>
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={ward} onChange={(e) => setWard(e.target.value)} placeholder="e.g. General" />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transfer Notes</label>
            <textarea rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Reason for transfer, handover notes…" />
          </div>
        </div>
      )}

      <label className="flex items-center gap-3 mt-4 cursor-pointer">
        <input type="checkbox" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} className="w-4 h-4" />
        <span className="text-sm text-gray-700">I confirm this {isDischarge ? 'discharge' : 'transfer'} is correct</span>
      </label>
    </FormShell>
  )
}
