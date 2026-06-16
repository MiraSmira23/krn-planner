// Date helpers that work on 'YYYY-MM-DD' strings in local time,
// avoiding timezone drift from Date.toISOString().

const MONTHS_GENITIVE = [
  'ledna',
  'února',
  'března',
  'dubna',
  'května',
  'června',
  'července',
  'srpna',
  'září',
  'října',
  'listopadu',
  'prosince',
]

const MONTHS_NOMINATIVE = [
  'leden',
  'únor',
  'březen',
  'duben',
  'květen',
  'červen',
  'červenec',
  'srpen',
  'září',
  'říjen',
  'listopad',
  'prosinec',
]

// Czech weekday short labels, Monday first.
export const WEEKDAYS_SHORT = ['po', 'út', 'st', 'čt', 'pá', 'so', 'ne']

// Short month labels for compact pickers.
export const MONTHS_SHORT = [
  'led',
  'úno',
  'bře',
  'dub',
  'kvě',
  'čvn',
  'čvc',
  'srp',
  'zář',
  'říj',
  'lis',
  'pro',
]

// Human label for a month, e.g. "červenec 2026".
export function formatMonth(year, monthIndex) {
  return `${MONTHS_NOMINATIVE[monthIndex]} ${year}`
}

export function parseDate(str) {
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function toKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function addDays(str, n) {
  const d = parseDate(str)
  d.setDate(d.getDate() + n)
  return toKey(d)
}

// All 'YYYY-MM-DD' keys from start to end inclusive.
export function eachDate(startStr, endStr) {
  const out = []
  let cur = parseDate(startStr)
  const end = parseDate(endStr)
  while (cur <= end) {
    out.push(toKey(cur))
    cur = parseDate(addDays(toKey(cur), 1))
  }
  return out
}

export function isWeekend(str) {
  const day = parseDate(str).getDay()
  return day === 0 || day === 6
}

// Human label for a single day, e.g. "12. července".
export function formatDay(str) {
  const d = parseDate(str)
  return `${d.getDate()}. ${MONTHS_GENITIVE[d.getMonth()]}`
}

// Human label for a single day including the year, e.g. "12. července 2026".
export function formatDayLong(str) {
  const d = parseDate(str)
  return `${d.getDate()}. ${MONTHS_GENITIVE[d.getMonth()]} ${d.getFullYear()}`
}

// Human label for a span of consecutive days.
export function formatRange(dates) {
  if (dates.length === 1) return formatDay(dates[0])
  const first = parseDate(dates[0])
  const last = parseDate(dates[dates.length - 1])
  if (first.getMonth() === last.getMonth()) {
    return `${first.getDate()}.–${last.getDate()}. ${MONTHS_GENITIVE[first.getMonth()]}`
  }
  return `${formatDay(dates[0])} – ${formatDay(dates[dates.length - 1])}`
}
