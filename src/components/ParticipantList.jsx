import { useState } from 'react'

export default function ParticipantList({
  names,
  activeName,
  onSelect,
  onAdd,
}) {
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState('')

  function confirm() {
    const name = draft.trim()
    if (!name) return
    onAdd(name)
    setDraft('')
    setAdding(false)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {names.map((name) => {
        const active = name === activeName
        return (
          <button
            key={name}
            type="button"
            onClick={() => onSelect(name)}
            className="rounded-full border px-3 py-1.5 text-[13px] transition-colors"
            style={{
              background: active ? '#1c1830' : '#1a1a24',
              borderColor: active ? '#a78bfa' : '#2a2a38',
              color: active ? '#e8e6f0' : '#b8b4d0',
            }}
            onMouseEnter={(e) => {
              if (!active) e.currentTarget.style.borderColor = '#7c6fe0'
            }}
            onMouseLeave={(e) => {
              if (!active) e.currentTarget.style.borderColor = '#2a2a38'
            }}
          >
            {name}
          </button>
        )
      })}

      {adding ? (
        <span className="flex items-center gap-1.5">
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') confirm()
              if (e.key === 'Escape') setAdding(false)
            }}
            placeholder="Tvé jméno"
            className="w-28 rounded-full border border-[#2a2a38] bg-[#1a1a24] px-3 py-1.5 text-[13px] text-[#e8e6f0] outline-none placeholder:text-[#6b6880] focus:border-[#7c6fe0]"
          />
          <button
            type="button"
            onClick={confirm}
            className="rounded-full bg-[#7c6fe0] px-3 py-1.5 text-[13px] text-white transition-colors hover:bg-[#8f84e8]"
          >
            Ok
          </button>
        </span>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="rounded-full border border-dashed border-[#2a2a38] px-3 py-1.5 text-[13px] text-[#3e3c52] transition-colors hover:border-[#a78bfa] hover:text-[#a78bfa]"
        >
          + Přidat se
        </button>
      )}
    </div>
  )
}
