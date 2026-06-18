import Link from 'next/link'

export default function FormCompletionList({ forms }) {
  const completed = forms.filter((form) => form.filled).length
  const total = forms.length

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-950">Care steps</h3>
            <p className="mt-1 text-sm text-slate-500">Open each step, fill it, then save.</p>
          </div>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">
            {completed}/{total} done
          </span>
        </div>
      </div>

      <ul className="divide-y divide-slate-100">
        {forms.map((form, index) => (
          <li key={form.label}>
            <Link
              href={form.href}
              className="flex min-h-16 items-center justify-between gap-3 px-4 py-3 transition hover:bg-blue-50/70"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                  form.filled ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {index + 1}
                </span>
                <span className="truncate text-sm font-semibold text-slate-800">{form.label}</span>
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                  form.filled
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {form.filled ? 'Done' : 'To do'}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
