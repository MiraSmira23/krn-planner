import { eachDate, parseDate, addDays, formatRange } from './dates'

export const PREF_SCORE = { great: 3, ok: 1, hard_no: -5 }

export const PREF_LABEL = {
  great: 'Ideální',
  ok: 'Zvládnu',
  hard_no: 'Nemůžu',
}

// Worst-first ordering used to aggregate a participant's stance over a block.
const PREF_RANK = { hard_no: 0, ok: 1, great: 2 }

export function labelFor(pref) {
  return pref ? PREF_LABEL[pref] : '—'
}

function entryFor(availabilities, name, date) {
  return availabilities[name]?.find((d) => d.date === date)
}

// Sum of all participants' preferences for a single day.
export function scoreDay(date, availabilities, participantNames) {
  let score = 0
  for (const name of participantNames) {
    const entry = entryFor(availabilities, name, date)
    if (entry && entry.preference in PREF_SCORE) {
      score += PREF_SCORE[entry.preference]
    }
  }
  return score
}

// Aggregate a participant's stance across a set of dates: the worst
// preference among the days they actually answered (null = no answer).
function aggregatePref(availabilities, name, dates) {
  let worst = null
  for (const date of dates) {
    const entry = entryFor(availabilities, name, date)
    if (!entry) continue
    if (worst === null || PREF_RANK[entry.preference] < PREF_RANK[worst]) {
      worst = entry.preference
    }
  }
  return worst
}

// Blocks of `durationDays` consecutive days where every day was selected
// by at least one participant.
export function findValidBlocks(
  availabilities,
  durationDays,
  windowStart,
  windowEnd
) {
  const allSelected = new Set()
  for (const days of Object.values(availabilities)) {
    days.forEach((d) => allSelected.add(d.date))
  }

  const blocks = []
  for (const start of eachDate(windowStart, windowEnd)) {
    const blockDays = []
    for (let i = 0; i < durationDays; i++) {
      blockDays.push(addDays(start, i))
    }
    const last = blockDays[blockDays.length - 1]
    if (last > windowEnd) break
    if (blockDays.every((d) => allSelected.has(d))) {
      blocks.push(blockDays)
    }
  }
  return blocks
}

// Build a display result for one candidate (set of dates).
function buildResult(dates, event, names, scoreFn) {
  const { availabilities } = event
  const participants = names.map((name) => ({
    name,
    pref: aggregatePref(availabilities, name, dates),
  }))
  return {
    key: dates.join('_'),
    dates,
    label: formatRange(dates),
    score: scoreFn(dates),
    participants,
    cantList: participants.filter((p) => p.pref === 'hard_no').map((p) => p.name),
  }
}

// Ranked list of candidate dates, best score first.
export function rankResults(event) {
  if (!event) return []
  const availabilities = event.availabilities || {}
  const names = Object.keys(availabilities)
  const { type, window_start, window_end, duration_days } = event

  const allSelected = new Set()
  for (const days of Object.values(availabilities)) {
    days.forEach((d) => allSelected.add(d.date))
  }

  const candidates = []

  if (type === 'weekend') {
    for (const date of eachDate(window_start, window_end)) {
      // Build Saturday+Sunday pairs.
      if (parseDate(date).getDay() !== 6) continue
      const sun = addDays(date, 1)
      if (sun > window_end) continue
      if (!allSelected.has(date) && !allSelected.has(sun)) continue
      const pair = [date, sun]
      candidates.push(
        buildResult(pair, event, names, (dates) => {
          const avg =
            dates.reduce(
              (s, d) => s + scoreDay(d, availabilities, names),
              0
            ) / dates.length
          return Math.round(avg * 10) / 10
        })
      )
    }
  } else if (type === 'multi_day') {
    const blocks = findValidBlocks(
      availabilities,
      duration_days || 2,
      window_start,
      window_end
    )
    for (const block of blocks) {
      candidates.push(
        buildResult(block, event, names, (dates) => {
          const avg =
            dates.reduce(
              (s, d) => s + scoreDay(d, availabilities, names),
              0
            ) / dates.length
          return Math.round(avg * 10) / 10
        })
      )
    }
  } else {
    // single_day / evening / lunch
    for (const date of eachDate(window_start, window_end)) {
      if (!allSelected.has(date)) continue
      candidates.push(
        buildResult([date], event, names, (dates) =>
          scoreDay(dates[0], availabilities, names)
        )
      )
    }
  }

  return candidates.sort((a, b) => b.score - a.score)
}
