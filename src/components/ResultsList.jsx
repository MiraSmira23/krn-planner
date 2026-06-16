import { labelFor } from '../lib/scoring'

const PREF_COLOR = {
  great: '#4ade80',
  ok: '#c8900a',
  hard_no: '#d84050',
}

export default function ResultsList({ results }) {
  if (results.length === 0) {
    return (
      <div className="rounded-[14px] border border-[#22222e] bg-[#16161f] p-[15px] text-center text-[14px] text-[#6b6880]">
        Zatím nikdo nehlasoval — žádné termíny k zobrazení.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {results.map((r, i) => (
        <div
          key={r.key}
          className="rounded-[14px] border border-[#22222e] bg-[#16161f] p-[15px]"
        >
          <div className="mb-2 flex items-baseline justify-between gap-3">
            <span className="flex items-baseline gap-2">
              <span className="text-[13px] text-[#6b6880]">#{i + 1}</span>
              <span className="text-[16px] text-[#e8e6f0] capitalize">
                {r.label}
              </span>
            </span>
            <span className="text-[13px] text-[#a78bfa]">skóre: {r.score}</span>
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[13px] text-[#b8b4d0]">
            {r.participants.map((p, idx) => (
              <span key={p.name}>
                {idx > 0 && <span className="text-[#3e3c52]">· </span>}
                {p.name}:{' '}
                <span style={{ color: p.pref ? PREF_COLOR[p.pref] : '#6b6880' }}>
                  {labelFor(p.pref)}
                </span>
              </span>
            ))}
          </div>

          <div className="mt-1 text-[12px] text-[#6b6880]">
            Nemůžou: {r.cantList.length ? r.cantList.join(', ') : '—'}
          </div>
        </div>
      ))}
    </div>
  )
}
