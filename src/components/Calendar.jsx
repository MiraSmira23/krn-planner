import { useMemo, useState } from 'react'
import { parseDate, toKey, formatMonth, WEEKDAYS_SHORT } from '../lib/dates'
import { PREFERENCES } from '../lib/constants'

// Visual style per preference for the day cells.
const PREF_STYLE = {
  great: { bg: '#0f2a1a', border: '#22c55e' },
  ok: { bg: '#1c1810', border: '#806010' },
  hard_no: { bg: '#1c1018', border: '#803040' },
}

const todayKey = toKey(new Date())

// Monday-first weekday index (0 = Monday … 6 = Sunday).
function weekdayMon(date) {
  return (date.getDay() + 6) % 7
}

export default function Calendar({
  event,
  selections,
  focusedDate,
  onDayClick,
  onMonthToggle,
}) {
  const start = parseDate(event.window_start)
  const end = parseDate(event.window_end)
  const weekendOnly = event.type === 'weekend'

  // Allowed navigation range, expressed as year*12 + month.
  const minIdx = start.getFullYear() * 12 + start.getMonth()
  const maxIdx = end.getFullYear() * 12 + end.getMonth()

  const [viewIdx, setViewIdx] = useState(minIdx)
  const year = Math.floor(viewIdx / 12)
  const month = viewIdx % 12

  const canPrev = viewIdx > minIdx
  const canNext = viewIdx < maxIdx

  // Is a given day inside the window and not filtered out by the event type?
  function isEnabled(date) {
    if (date < start || date > end) return false
    if (weekendOnly) {
      const d = date.getDay()
      if (d !== 0 && d !== 6) return false
    }
    return true
  }

  // Build the cells for the visible month (with leading blanks).
  const cells = useMemo(() => {
    const first = new Date(year, month, 1)
    const lead = weekdayMon(first)
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const out = []
    for (let i = 0; i < lead; i++) out.push(null)
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d)
      out.push({ date, key: toKey(date), enabled: isEnabled(date) })
    }
    return out
  }, [year, month]) // eslint-disable-line react-hooks/exhaustive-deps

  // Enabled keys in this month + whether they're all already selected.
  const enabledKeys = cells.filter((c) => c && c.enabled).map((c) => c.key)
  const allSelected =
    enabledKeys.length > 0 && enabledKeys.every((k) => selections[k])

  return (
    <div className="flex flex-col">
      {/* Header: navigation + month title */}
      <div className="mb-3 flex items-center justify-between">
        <NavButton
          disabled={!canPrev}
          onClick={() => canPrev && setViewIdx((v) => v - 1)}
          dir="prev"
        />
        <span className="text-[15px] font-medium capitalize text-[#cdc9e0]">
          {formatMonth(year, month)}
        </span>
        <NavButton
          disabled={!canNext}
          onClick={() => canNext && setViewIdx((v) => v + 1)}
          dir="next"
        />
      </div>

      {/* Whole-month toggle */}
      <button
        type="button"
        disabled={enabledKeys.length === 0}
        onClick={() => onMonthToggle(enabledKeys)}
        className="mb-3 self-center rounded-full border px-3 py-1 text-[12px] transition-all hover:-translate-y-px disabled:cursor-default disabled:opacity-40"
        style={{
          borderColor: allSelected ? '#a78bfa' : '#2a2838',
          color: allSelected ? '#c4b5fd' : '#8b87a3',
          background: allSelected ? '#1a1530' : 'transparent',
        }}
      >
        {allSelected ? 'Zrušit celý měsíc' : 'Označit celý měsíc'}
      </button>

      {/* Weekday header */}
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS_SHORT.map((w) => (
          <div
            key={w}
            className="pb-1 text-center text-[11px] lowercase text-[#46445c]"
          >
            {w}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) => {
          if (!cell) return <div key={`b${i}`} />
          const { date, key, enabled } = cell
          const pref =
            selections[key] === 'great'
              ? 'great'
              : selections[key] === 'ok'
                ? 'ok'
                : selections[key] === 'hard_no'
                  ? 'hard_no'
                  : null
          const style = pref ? PREF_STYLE[pref] : null
          const focused = focusedDate === key
          const isToday = key === todayKey

          return (
            <button
              key={key}
              type="button"
              disabled={!enabled}
              onClick={() => enabled && onDayClick(key)}
              className={`day-cell relative flex h-10 items-center justify-center rounded-[10px] border text-[15px] transition-all${
                enabled && !pref ? ' day-hoverable' : ''
              }`}
              style={{
                background: style ? style.bg : 'transparent',
                borderColor: focused
                  ? '#a78bfa'
                  : style
                    ? style.border
                    : 'transparent',
                color: enabled ? '#e8e6f0' : '#2a2838',
                cursor: enabled ? 'pointer' : 'default',
                boxShadow: focused ? '0 0 0 1px #a78bfa' : 'none',
              }}
            >
              {date.getDate()}
              {isToday && enabled && (
                <span className="absolute bottom-1 h-[3px] w-[3px] rounded-full bg-[#7c6fe0]" />
              )}
            </button>
          )
        })}
      </div>

      <Legend />
    </div>
  )
}

function NavButton({ disabled, onClick, dir }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-[9px] text-[#b8b4d0] transition-all hover:bg-[#1a1a24] hover:text-[#a78bfa] disabled:cursor-default disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-[#b8b4d0]"
      aria-label={dir === 'prev' ? 'Předchozí měsíc' : 'Další měsíc'}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d={dir === 'prev' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

function Legend() {
  return (
    <div className="mt-4 flex items-center justify-center gap-4">
      {PREFERENCES.map((p) => (
        <span key={p.value} className="flex items-center gap-1.5">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: p.dot }}
          />
          <span className="text-[10px] text-[#6b6880]">{p.label}</span>
        </span>
      ))}
    </div>
  )
}
