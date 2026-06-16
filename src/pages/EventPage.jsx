import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Topbar from '../components/Topbar'
import Calendar from '../components/Calendar'
import ParticipantList from '../components/ParticipantList'
import PreferenceSelector from '../components/PreferenceSelector'
import { getEvent, saveAvailability } from '../lib/jsonbin'
import { eventTypeLabel } from '../lib/constants'

const labelCls = 'mb-2 block text-[10px] uppercase tracking-[0.08em] text-[#3e3c52]'

export default function EventPage() {
  const { id } = useParams()
  const [event, setEvent] = useState(undefined) // undefined = loading, null = not found
  const [names, setNames] = useState([])
  const [activeName, setActiveName] = useState(null)
  const [selections, setSelections] = useState({}) // { 'YYYY-MM-DD': preference }
  const [focusedDate, setFocusedDate] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getEvent(id).then((ev) => {
      setEvent(ev)
      if (ev) setNames(Object.keys(ev.availabilities || {}))
    })
  }, [id])

  function selectName(name) {
    setActiveName(name)
    setFocusedDate(null)
    setSaved(false)
    const days = event.availabilities?.[name] || []
    const map = {}
    days.forEach((d) => (map[d.date] = d.preference))
    setSelections(map)
  }

  function addName(name) {
    if (!names.includes(name)) setNames((prev) => [...prev, name])
    setActiveName(name)
    setSelections({})
    setFocusedDate(null)
    setSaved(false)
  }

  function handleDayClick(dateStr) {
    setSaved(false)
    setSelections((prev) => {
      if (prev[dateStr]) return prev // already selected, just focus
      return { ...prev, [dateStr]: 'great' }
    })
    setFocusedDate(dateStr)
  }

  function handleMonthToggle(keys) {
    setSaved(false)
    setSelections((prev) => {
      const allSet = keys.length > 0 && keys.every((k) => prev[k])
      const next = { ...prev }
      if (allSet) {
        // Whole month already selected → clear it.
        keys.forEach((k) => delete next[k])
      } else {
        // Fill the gaps with the default preference.
        keys.forEach((k) => {
          if (!next[k]) next[k] = 'great'
        })
      }
      return next
    })
    setFocusedDate(null)
  }

  function changePref(pref) {
    setSelections((prev) => ({ ...prev, [focusedDate]: pref }))
  }

  function removeDay() {
    setSelections((prev) => {
      const next = { ...prev }
      delete next[focusedDate]
      return next
    })
    setFocusedDate(null)
  }

  async function save() {
    setSaving(true)
    try {
      const days = Object.entries(selections).map(([date, preference]) => ({
        date,
        preference,
      }))
      await saveAvailability(id, activeName, days)
      setSaved(true)
    } catch (err) {
      console.error(err)
      alert('Uložení selhalo. Zkus to znovu.')
    }
    setSaving(false)
  }

  if (event === undefined) {
    return (
      <div className="min-h-svh">
        <Topbar />
        <p className="px-5 py-8 text-[14px] text-[#6b6880]">Načítám…</p>
      </div>
    )
  }

  if (event === null) {
    return (
      <div className="min-h-svh">
        <Topbar />
        <div className="mx-auto max-w-[480px] px-5 py-16 text-center">
          <h1 className="mb-2 text-[20px] text-[#e8e6f0]">Event nenalezen</h1>
          <p className="text-[14px] text-[#6b6880]">
            Tento odkaz neexistuje nebo byl event smazán.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-svh">
      <Topbar eventTitle={event.title} />

      <main className="mx-auto max-w-[440px] px-5 py-6">
        <div className="mb-4">
          <h1 className="text-[20px] text-[#e8e6f0]">{event.title}</h1>
          <p className="text-[13px] text-[#6b6880]">
            {eventTypeLabel(event.type)}
            {event.type === 'multi_day' ? ` · ${event.duration_days} dní` : ''}
          </p>
        </div>

        {/* Part A — participants */}
        <div className="mb-3 fade-up rounded-[14px] border border-[#22222e] bg-[#16161f] p-[15px]">
          <span className={labelCls}>Účastníci</span>
          <ParticipantList
            names={names}
            activeName={activeName}
            onSelect={selectName}
            onAdd={addName}
          />
        </div>

        {activeName ? (
          <>
            {/* Part B — calendar */}
            <div className="mb-3 fade-up-delay rounded-[14px] border border-[#22222e] bg-[#16161f] p-[15px]">
              <span className={labelCls}>
                Kalendář — {activeName}
              </span>
              <Calendar
                event={event}
                selections={selections}
                focusedDate={focusedDate}
                onDayClick={handleDayClick}
                onMonthToggle={handleMonthToggle}
              />
            </div>

            {focusedDate && (
              <div className="mb-3">
                <PreferenceSelector
                  date={focusedDate}
                  value={selections[focusedDate]}
                  onChange={changePref}
                  onRemove={removeDay}
                />
              </div>
            )}

            {/* Part C — submit */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="rounded-[9px] bg-[#7c6fe0] px-5 py-2.5 text-[14px] text-white transition-all hover:-translate-y-px hover:bg-[#8f84e8] disabled:opacity-60"
              >
                {saving ? 'Ukládám…' : 'Uložit'}
              </button>
              <Link
                to={`/event/${id}/results`}
                className="text-[13px] text-[#a78bfa] transition-colors hover:text-[#c4b5fd]"
              >
                Zobrazit výsledky →
              </Link>
            </div>

            {saved && (
              <p className="mt-3 text-[13px] text-[#4ade80]">
                Uloženo. Tvé odpovědi jsou zaznamenané.
              </p>
            )}
          </>
        ) : (
          <p className="px-1 text-[14px] text-[#6b6880]">
            Vyber své jméno nebo se přidej, abys mohl/a hlasovat.
          </p>
        )}
      </main>
    </div>
  )
}
