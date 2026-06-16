import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { eventTypeLabel } from '../lib/constants'
import { formatDay } from '../lib/dates'

export default function EventCard({ event, onDelete }) {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  const respondents = Object.keys(event.availabilities || {}).length

  function copyLink() {
    const url = `${window.location.origin}/event/${event.id}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="rounded-[14px] border border-[#22222e] bg-[#16161f] p-[15px] transition-colors hover:border-[#2e2e40]">
      <div className="mb-1 text-[16px] text-[#e8e6f0]">{event.title}</div>
      <div className="mb-3 flex flex-wrap items-center gap-2 text-[12px] text-[#6b6880]">
        <span className="rounded-full border border-[#22222e] bg-[#1a1a24] px-2 py-0.5">
          {eventTypeLabel(event.type)}
          {event.type === 'multi_day' ? ` · ${event.duration_days} dní` : ''}
        </span>
        <span>
          {formatDay(event.window_start)} – {formatDay(event.window_end)}
        </span>
        <span>· {respondents} respondentů</span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copyLink}
          className="rounded-[7px] border border-[#22222e] bg-[#1a1a24] px-3 py-1.5 text-[12px] text-[#b8b4d0] transition-colors hover:border-[#7c6fe0] hover:text-[#a78bfa]"
        >
          {copied ? 'Zkopírováno' : 'Kopírovat link'}
        </button>
        <button
          type="button"
          onClick={() => navigate(`/event/${event.id}/results`)}
          className="rounded-[7px] border border-[#22222e] bg-[#1a1a24] px-3 py-1.5 text-[12px] text-[#b8b4d0] transition-colors hover:border-[#7c6fe0] hover:text-[#a78bfa]"
        >
          Zobrazit výsledky
        </button>
        <button
          type="button"
          onClick={() => onDelete(event)}
          className="rounded-[7px] border border-[#22222e] bg-[#1a1a24] px-3 py-1.5 text-[12px] text-[#6b6880] transition-colors hover:border-[#803040] hover:text-[#d84050]"
        >
          Smazat
        </button>
      </div>
    </div>
  )
}
