'use client'

import Link from 'next/link'

export default function FormShell({ title, backHref, backLabel = 'Back', children, saving = false, onSave, saveLabel = 'Save' }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <Link href={backHref} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
          ← {backLabel}
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h1 className="text-lg font-bold text-gray-800">{title}</h1>
        </div>
        <div className="px-6 py-5">{children}</div>
        {onSave && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
            <Link href={backHref} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
              Cancel
            </Link>
            <button
              onClick={onSave}
              disabled={saving}
              className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving…' : saveLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
