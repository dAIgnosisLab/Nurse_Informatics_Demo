export default function AlertBanner({ alerts }) {
  if (!alerts || alerts.length === 0) return null

  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 shadow-sm sm:px-5">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-600 text-base font-black text-white">
          !
        </div>
        <div className="min-w-0">
          <p className="text-base font-bold text-red-900">Check these values</p>
          <p className="mt-1 text-sm text-red-700">Review the patient and record any action taken.</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {alerts.map((alert, index) => (
              <li key={index} className="rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-800">
                {alert}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
