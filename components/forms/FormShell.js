'use client'

import Link from 'next/link'

export default function FormShell({
  title,
  backHref,
  backLabel = 'Back',
  children,
  saving = false,
  onSave,
  saveLabel = 'Save',
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6 sm:py-7">
      <Link
        href={backHref}
        className="mb-4 inline-flex min-h-11 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
      >
        Back to {backLabel}
      </Link>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-5 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Patient form</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-950">{title}</h1>
          <p className="mt-2 text-sm text-slate-600">Enter what you know. Required fields are marked with *.</p>
        </div>

        <div className="px-5 py-5 sm:px-6">{children}</div>

        {onSave && (
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <Link
              href={backHref}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </Link>
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Saving...' : saveLabel}
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
