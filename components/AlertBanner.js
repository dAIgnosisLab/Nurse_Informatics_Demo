export default function AlertBanner({ alerts }) {
  if (!alerts || alerts.length === 0) return null

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-start gap-3">
      <span className="text-red-500 text-lg leading-none mt-0.5">⚠</span>
      <div>
        <p className="font-semibold text-red-700 text-sm">Abnormal Values Detected</p>
        <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5">
          {alerts.map((a, i) => (
            <li key={i} className="text-sm text-red-600">
              {a}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
