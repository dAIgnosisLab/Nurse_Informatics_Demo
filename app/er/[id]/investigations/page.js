'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import FormShell from '@/components/forms/FormShell'

const INV_TYPES = ['CBC', 'RBS', 'ECG', 'Xray', 'Other']

export default function InvestigationsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [items, setItems] = useState(INV_TYPES.map((t) => ({ type: t, checked: false, notes: '' })))

  const toggle = (i) => setItems((prev) => prev.map((item, idx) => idx === i ? { ...item, checked: !item.checked } : item))
  const setNotes = (i, v) => setItems((prev) => prev.map((item, idx) => idx === i ? { ...item, notes: v } : item))

  async function handleSave() {
    const selected = items.filter((i) => i.checked)
    if (selected.length === 0) { setError('Select at least one investigation.'); return }
    setSaving(true)
    setError('')
    try {
      await Promise.all(
        selected.map((item) =>
          fetch(`/api/patients/${id}/investigations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: item.type, status: 'Ordered', notes: item.notes || undefined }),
          })
        )
      )
      router.push(`/er/${id}/diagnosis`)
    } catch (e) {
      setError(e.message)
      setSaving(false)
    }
  }

  return (
    <FormShell title="Investigations" backHref={`/er/${id}/clinical-details`} backLabel="Clinical Details" onSave={handleSave} saving={saving} saveLabel="Save & Continue →">
      {error && <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={item.type} className={`border rounded-lg p-3 transition-colors ${item.checked ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggle(i)}
                className="w-4 h-4 text-blue-600"
              />
              <span className={`font-medium ${item.checked ? 'text-blue-700' : 'text-gray-700'}`}>{item.type}</span>
            </label>
            {item.checked && (
              <input
                className="mt-2 w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Notes (optional)"
                value={item.notes}
                onChange={(e) => setNotes(i, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
    </FormShell>
  )
}
