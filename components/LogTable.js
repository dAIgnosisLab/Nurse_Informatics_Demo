'use client'

import { useState } from 'react'
import { format } from 'date-fns'

export default function LogTable({ title, columns, rows, addForm, emptyMessage = 'No entries yet.' }) {
  const [showAdd, setShowAdd] = useState(false)
  const rowCount = rows?.length ?? 0

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <h3 className="text-lg font-bold text-slate-950">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">
            {rowCount === 0 ? 'No records added' : `${rowCount} record${rowCount === 1 ? '' : 's'} added`}
          </p>
        </div>

        {addForm && (
          <button
            type="button"
            onClick={() => setShowAdd((value) => !value)}
            aria-expanded={showAdd}
            className={`min-h-11 rounded-xl px-4 text-sm font-bold transition ${
              showAdd
                ? 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {showAdd ? 'Close form' : 'Add new record'}
          </button>
        )}
      </div>

      {showAdd && addForm && (
        <div className="border-b border-blue-100 bg-blue-50 px-4 py-5 sm:px-5">
          <div className="mb-4">
            <p className="text-sm font-bold text-blue-900">New record</p>
            <p className="mt-1 text-sm text-blue-700">Fill the needed fields, then save.</p>
          </div>
          {addForm(() => setShowAdd(false))}
        </div>
      )}

      {rowCount > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-max text-sm">
            <thead className="bg-white">
              <tr className="border-b border-slate-200">
                {columns.map((col) => (
                  <th key={col.key} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row, i) => (
                <tr key={row.id ?? i} className="transition hover:bg-blue-50/50">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 font-medium text-slate-700">
                      {renderCell(col, row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !showAdd && (
          <div className="px-5 py-10 text-center">
            <p className="text-base font-semibold text-slate-700">{emptyMessage}</p>
            {addForm && (
              <button
                type="button"
                onClick={() => setShowAdd(true)}
                className="mt-4 min-h-11 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                Add first record
              </button>
            )}
          </div>
        )
      )}
    </section>
  )
}

function renderCell(col, row) {
  const value = row[col.key]

  if (col.render) return col.render(value, row)
  if (col.isDate && value) return format(new Date(value), 'dd MMM, h:mm a')
  return value ?? '-'
}
