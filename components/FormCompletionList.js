import Link from 'next/link'

export default function FormCompletionList({ forms }) {
  const completed = forms.filter((form) => form.filled).length
  const total = forms.length

  return (
    <section className="overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-sky-100 bg-sky-50 px-5 py-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Care Steps</h3>
          <p className="mt-0.5 text-sm text-slate-500">Open each step, fill it, then save.</p>
        </div>
        <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold text-cyan-800">
          {completed}/{total} done
        </span>
      </div>

      <ul className="divide-y divide-sky-50">
        {forms.map((form, index) => (
          <li key={form.label}>
            <Link
              href={form.href}
              className="flex min-h-14 items-center justify-between gap-3 px-5 py-3 transition hover:bg-sky-50"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                  form.filled ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {index + 1}
                </span>
                <span className="truncate text-sm font-semibold text-slate-800">{form.label}</span>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                form.filled ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
              }`}>
                {form.filled ? 'Done' : 'To do'}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
