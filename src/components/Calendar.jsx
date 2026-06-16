import { DayPicker } from 'react-day-picker'
import { cs } from 'date-fns/locale'
import { parseDate, toKey } from '../lib/dates'
import { PREFERENCES } from '../lib/constants'

const MOD_CLASS = {
  great: 'day-great',
  ok: 'day-ok',
  hardno: 'day-hardno',
  focused: 'day-focused',
}

export default function Calendar({ event, selections, focusedDate, onDayClick }) {
  const start = parseDate(event.window_start)
  const end = parseDate(event.window_end)

  // Disable days outside the window; for weekend events also disable weekdays.
  const disabled = [{ before: start }, { after: end }]
  if (event.type === 'weekend') {
    disabled.push((date) => {
      const d = date.getDay()
      return d !== 0 && d !== 6
    })
  }

  // Build modifiers from the current selections + focus.
  const modifiers = { great: [], ok: [], hardno: [], focused: [] }
  for (const [dateStr, pref] of Object.entries(selections)) {
    const date = parseDate(dateStr)
    if (pref === 'great') modifiers.great.push(date)
    else if (pref === 'ok') modifiers.ok.push(date)
    else if (pref === 'hard_no') modifiers.hardno.push(date)
  }
  if (focusedDate) modifiers.focused.push(parseDate(focusedDate))

  return (
    <div className="flex flex-col items-center">
      <DayPicker
        className="rdp-krn"
        locale={cs}
        defaultMonth={start}
        startMonth={start}
        endMonth={end}
        disabled={disabled}
        modifiers={modifiers}
        modifiersClassNames={MOD_CLASS}
        onDayClick={(date, mods) => {
          if (mods.disabled) return
          onDayClick(toKey(date))
        }}
      />
      <Legend />
    </div>
  )
}

function Legend() {
  return (
    <div className="mt-2 flex items-center justify-center gap-4">
      {PREFERENCES.map((p) => (
        <span key={p.value} className="flex items-center gap-1.5">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: p.dot }}
          />
          <span className="text-[10px] text-[#3e3c52]">{p.label}</span>
        </span>
      ))}
    </div>
  )
}
