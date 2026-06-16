import { PREFERENCES } from '../lib/constants'
import { formatDay } from '../lib/dates'

export default function PreferenceSelector({ date, value, onChange, onRemove }) {
  return (
    <div className="rounded-[14px] border border-[#22222e] bg-[#16161f] p-[15px]">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[13px] text-[#b8b4d0] capitalize">
          {formatDay(date)}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="text-[12px] text-[#6b6880] transition-colors hover:text-[#d84050]"
        >
          Odebrat
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {PREFERENCES.map((p) => {
          const active = value === p.value
          const c = active ? p.active : p.idle
          return (
            <button
              key={p.value}
              type="button"
              onClick={() => onChange(p.value)}
              className="flex items-center justify-center gap-1.5 rounded-[9px] border px-2 py-2 text-[13px] transition-all"
              style={{
                background: c.bg,
                borderColor: c.border,
                color: c.text,
              }}
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: p.dot }}
              />
              {p.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
