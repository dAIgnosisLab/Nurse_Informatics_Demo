'use client'

import { useState } from 'react'
import { format } from 'date-fns'

export default function LogTable({ title, columns, rows, addForm, emptyMessage = 'No entries yet.' }) {
  const [showAdd, setShowAdd] = useState(false)

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <h3 className="font-semibold text-gray-700">{title}</h3>
        {addForm && (
          <button
            onClick={() => setShowAdd((v) => !v)}
            className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showAdd ? 'Cancel' : '+ Add Entry'}
          </button>
        )}
      </div>

      {showAdd && addForm && (
        <div className="px-5 py-4 border-b border-gray-200 bg-blue-50">
          {addForm(() => setShowAdd(false))}
        </div>
      )}

      {rows && rows.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="px-4 py-2.5 text-left font-medium text-gray-600 whitespace-nowrap">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row, i) => (
                <tr key={row.id ?? i} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-2.5 text-gray-700 whitespace-nowrap">
                      {col.render
                        ? col.render(row[col.key], row)
                        : col.isDate && row[col.key]
                        ? format(new Date(row[col.key]), 'dd MMM HH:mm')
                        : row[col.key] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !showAdd && (
          <p className="px-5 py-6 text-sm text-gray-400 text-center">{emptyMessage}</p>
        )
      )}
    </div>
  )
}
