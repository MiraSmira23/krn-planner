import { useState } from 'react'
import {
  parseDate,
  toKey,
  formatMonth,
  formatDayLong,
  WEEKDAYS_SHORT,
  MONTHS_SHORT,
} from '../lib/dates'

const todayKey = toKey(new Date())

function weekdayMon(date) {
  return (date.getDay() + 6) % 7
}

// Inline calendar for picking a date range (event window). Pick day-by-day,
// or switch to month mode to span whole months (e.g. June–August).
export default function RangeCalendar({ start, end, onChange, min }) {
  const minKey = min || todayKey
  const minDate = parseDate(minKey)
  const minMonthIdx = minDate.getFullYear() * 12 + minDate.getMonth()

  const [mode, setMode] = useState('days') // 'days' | 'months'

  return (
    <div className="rounded-[12px] border border-[#22222e] bg-[#13131b] p-4">
      {/* Mode toggle */}
      <div className="mb-3 grid grid-cols-2 gap-1 rounded-[9px] bg-[#1a1a24] p-1">
        {[
          { k: 'days', label: 'Dny' },
          { k: 'months', label: 'Měsíce' },
        ].map((t) => (
          <button
            key={t.k}
            type="button"
            onClick={() => setMode(t.k)}
            className="rounded-[7px] py-1.5 text-[13px] transition-colors"
            style={{
              background: mode === t.k ? '#7c6fe0' : 'transparent',
              color: mode === t.k ? '#fff' : '#8b87a3',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {mode === 'days' ? (
        <DayView
          start={start}
          end={end}
          onChange={onChange}
          minKey={minKey}
          minMonthIdx={minMonthIdx}
        />
      ) : (
        <MonthView
          start={start}
          end={end}
          onChange={onChange}
          minKey={minKey}
          minDate={minDate}
        />
      )}

      {/* Selected range summary */}
      <p className="mt-3 text-center text-[12px] text-[#6b6880]">
        {start && end ? (
          <span className="capitalize text-[#b8b4d0]">
            {formatDayLong(start)} – {formatDayLong(end)}
          </span>
        ) : start ? (
          'Vyber konec okna…'
        ) : (
          'Vyber začátek okna'
        )}
      </p>
    </div>
  )
}

function DayView({ start, end, onChange, minKey, minMonthIdx }) {
  const [viewIdx, setViewIdx] = useState(() => {
    const d = start ? parseDate(start) : parseDate(minKey)
    return Math.max(minMonthIdx, d.getFullYear() * 12 + d.getMonth())
  })
  const [hovered, setHovered] = useState(null)

  const year = Math.floor(viewIdx / 12)
  const month = viewIdx % 12
  const canPrev = viewIdx > minMonthIdx

  function clickDay(key) {
    if (!start || (start && end)) return onChange(key, '')
    if (key < start) onChange(key, '')
    else onChange(start, key)
  }

  function selectWholeMonth() {
    const firstKey = toKey(new Date(year, month, 1))
    const lastKey = toKey(new Date(year, month + 1, 0))
    const from = firstKey < minKey ? minKey : firstKey
    if (from > lastKey) return
    onChange(from, lastKey)
  }

  const previewEnd = end || (start && hovered && hovered >= start ? hovered : null)

  const first = new Date(year, month, 1)
  const lead = weekdayMon(first)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < lead; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))

  const monthDisabled = toKey(new Date(year, month + 1, 0)) < minKey

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <NavButton disabled={!canPrev} onClick={() => canPrev && setViewIdx((v) => v - 1)} dir="prev" />
        <span className="text-[15px] font-medium capitalize text-[#cdc9e0]">
          {formatMonth(year, month)}
        </span>
        <NavButton onClick={() => setViewIdx((v) => v + 1)} dir="next" />
      </div>

      <button
        type="button"
        disabled={monthDisabled}
        onClick={selectWholeMonth}
        className="mb-3 w-full rounded-[9px] border border-[#2a2838] bg-[#1a1a24] py-2 text-[13px] text-[#b8b4d0] transition-all hover:border-[#7c6fe0] hover:text-[#a78bfa] disabled:cursor-default disabled:opacity-40 disabled:hover:border-[#2a2838] disabled:hover:text-[#b8b4d0]"
      >
        Označit celý měsíc
      </button>

      <div className="mb-1 grid grid-cols-7 gap-1">
        {WEEKDAYS_SHORT.map((w) => (
          <div key={w} className="text-center text-[11px] lowercase text-[#46445c]">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1" onMouseLeave={() => setHovered(null)}>
        {cells.map((date, i) => {
          if (!date) return <div key={`b${i}`} />
          const key = toKey(date)
          const enabled = key >= minKey
          const isEdge = key === start || key === previewEnd
          const inRange = start && previewEnd && key > start && key < previewEnd
          const isToday = key === todayKey

          return (
            <button
              key={key}
              type="button"
              disabled={!enabled}
              onMouseEnter={() => enabled && setHovered(key)}
              onClick={() => enabled && clickDay(key)}
              className={`relative flex h-11 items-center justify-center border text-[15px] transition-colors${
                inRange && !isEdge ? ' rounded-none' : ' rounded-[9px]'
              }${enabled && !isEdge && !inRange ? ' day-hoverable' : ''}`}
              style={{
                background: isEdge ? '#7c6fe0' : inRange ? '#241d3d' : 'transparent',
                borderColor: isEdge ? '#7c6fe0' : 'transparent',
                color: isEdge ? '#fff' : enabled ? '#e8e6f0' : '#2a2838',
                cursor: enabled ? 'pointer' : 'default',
              }}
            >
              {date.getDate()}
              {isToday && enabled && !isEdge && (
                <span className="absolute bottom-1 h-[3px] w-[3px] rounded-full bg-[#7c6fe0]" />
              )}
            </button>
          )
        })}
      </div>
    </>
  )
}

function MonthView({ start, end, onChange, minKey, minDate }) {
  const minYear = minDate.getFullYear()
  const [viewYear, setViewYear] = useState(() =>
    Math.max(minYear, start ? parseDate(start).getFullYear() : minYear)
  )
  const [hovered, setHovered] = useState(null) // hovered month idx (y*12+m)

  const canPrevYear = viewYear > minYear

  // Month index (y*12+m) of the current selection edges.
  const startIdx = start ? monthIdxOf(start) : null
  const endIdx = end ? monthIdxOf(end) : null
  const previewEnd =
    endIdx ?? (startIdx != null && hovered != null && hovered >= startIdx ? hovered : null)

  function clickMonth(m) {
    const idx = viewYear * 12 + m
    const firstKey = toKey(new Date(viewYear, m, 1))
    const lastKey = toKey(new Date(viewYear, m + 1, 0))
    const from = firstKey < minKey ? minKey : firstKey
    if (!start || (start && end)) return onChange(from, '')
    if (startIdx != null && idx < startIdx) onChange(from, '')
    else onChange(start, lastKey)
  }

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <NavButton disabled={!canPrevYear} onClick={() => canPrevYear && setViewYear((y) => y - 1)} dir="prev" />
        <span className="text-[15px] font-medium text-[#cdc9e0]">{viewYear}</span>
        <NavButton onClick={() => setViewYear((y) => y + 1)} dir="next" />
      </div>

      <div className="grid grid-cols-3 gap-2" onMouseLeave={() => setHovered(null)}>
        {MONTHS_SHORT.map((label, m) => {
          const idx = viewYear * 12 + m
          const lastKey = toKey(new Date(viewYear, m + 1, 0))
          const enabled = lastKey >= minKey
          const isEdge = idx === startIdx || idx === previewEnd
          const inRange =
            startIdx != null && previewEnd != null && idx > startIdx && idx < previewEnd

          return (
            <button
              key={m}
              type="button"
              disabled={!enabled}
              onMouseEnter={() => enabled && setHovered(idx)}
              onClick={() => enabled && clickMonth(m)}
              className={`flex h-12 items-center justify-center border text-[14px] capitalize transition-colors${
                inRange && !isEdge ? ' rounded-none' : ' rounded-[9px]'
              }${enabled && !isEdge && !inRange ? ' day-hoverable' : ''}`}
              style={{
                background: isEdge ? '#7c6fe0' : inRange ? '#241d3d' : 'transparent',
                borderColor: isEdge ? '#7c6fe0' : 'transparent',
                color: isEdge ? '#fff' : enabled ? '#e8e6f0' : '#2a2838',
                cursor: enabled ? 'pointer' : 'default',
              }}
            >
              {label}
            </button>
          )
        })}
      </div>
    </>
  )
}

function monthIdxOf(key) {
  const d = parseDate(key)
  return d.getFullYear() * 12 + d.getMonth()
}

function NavButton({ disabled, onClick, dir }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-[9px] text-[#b8b4d0] transition-all hover:bg-[#1a1a24] hover:text-[#a78bfa] disabled:cursor-default disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-[#b8b4d0]"
      aria-label={dir === 'prev' ? 'Předchozí' : 'Další'}
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
