'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import FormShell from '@/components/forms/FormShell'

export default function GeneralConditionPage() {
  const { id } = useParams()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    consciousness: 'Alert', gcsScore: '15', painLevel: '2',
    orientedTime: true, orientedPlace: true, orientedPerson: true,
  })
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const body = {
        consciousness: form.consciousness,
        orientedTime: form.orientedTime,
        orientedPlace: form.orientedPlace,
        orientedPerson: form.orientedPerson,
      }
      if (form.gcsScore) body.gcsScore = parseInt(form.gcsScore)
      if (form.painLevel !== '') body.painLevel = parseInt(form.painLevel)

      const res = await fetch(`/api/patients/${id}/general-condition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Failed to save')
      router.push(`/ipd/${id}`)
    } catch (e) {
      setError(e.message)
      setSaving(false)
    }
  }

  return (
    <FormShell title="General Condition" backHref={`/ipd/${id}`} backLabel="Patient Dashboard" onSave={handleSave} saving={saving}>
      {error && <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Level of Consciousness</label>
          <div className="grid grid-cols-2 gap-2">
            {['Alert', 'Confused', 'Drowsy', 'Unconscious'].map((v) => (
              <button key={v} onClick={() => set('consciousness', v)} className={`p-2.5 rounded-lg border text-sm transition-colors ${form.consciousness === v ? 'border-blue-400 bg-blue-50 text-blue-700 font-medium' : 'border-gray-200 hover:bg-gray-50'}`}>
                {v}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GCS Score (3–15)</label>
            <input type="number" min="3" max="15" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.gcsScore} onChange={(e) => set('gcsScore', e.target.value)} placeholder="15" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pain Level (0–10)</label>
            <input type="number" min="0" max="10" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.painLevel} onChange={(e) => set('painLevel', e.target.value)} placeholder="0" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Orientation</label>
          <div className="flex gap-4">
            {[['orientedTime', 'Time'], ['orientedPlace', 'Place'], ['orientedPerson', 'Person']].map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form[key]} onChange={(e) => set(key, e.target.checked)} className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </FormShell>
  )
}
