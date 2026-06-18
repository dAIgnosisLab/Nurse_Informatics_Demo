import Link from 'next/link'

export default function FormCompletionList({ forms }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <h3 className="font-semibold text-gray-700 text-sm">Form Completion</h3>
      </div>
      <ul className="divide-y divide-gray-100">
        {forms.map((form) => (
          <li key={form.label}>
            <Link
              href={form.href}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm text-gray-700">{form.label}</span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                  form.filled
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {form.filled ? 'Filled' : 'Pending'}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
