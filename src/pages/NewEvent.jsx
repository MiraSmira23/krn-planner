import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import Topbar from '../components/Topbar'
import { createEvent } from '../lib/jsonbin'
import { EVENT_TYPES } from '../lib/constants'
import { toKey } from '../lib/dates'

const labelCls = 'mb-1.5 block text-[10px] uppercase tracking-[0.08em] text-[#3e3c52]'
const inputCls =
  'w-full rounded-[9px] border border-[#2a2a38] bg-[#1a1a24] px-3 py-2.5 text-[14px] text-[#e8e6f0] outline-none placeholder:text-[#6b6880] focus:border-[#7c6fe0]'

export default function NewEvent() {
  const navigate = useNavigate()
  const today = toKey(new Date())

  const [title, setTitle] = useState('')
  const [type, setType] = useState('single_day')
  const [durationDays, setDurationDays] = useState(3)
  const [windowStart, setWindowStart] = useState(today)
  const [windowEnd, setWindowEnd] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function quickWeeks(weeks) {
    const start = new Date()
    const end = new Date()
    end.setDate(end.getDate() + weeks * 7)
    setWindowStart(toKey(start))
    setWindowEnd(toKey(end))
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    if (!title.trim()) return setError('Zadej název.')
    if (!windowStart || !windowEnd) return setError('Vyber časové okno.')
    if (windowEnd < windowStart) return setError('Konec okna je před začátkem.')

    const event = {
      id: uuidv4(),
      title: title.trim(),
      type,
      duration_days: type === 'multi_day' ? Number(durationDays) : 1,
      window_start: windowStart,
      window_end: windowEnd,
      created_at: new Date().toISOString(),
      availabilities: {},
    }

    setSaving(true)
    try {
      await createEvent(event)
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      setError('Uložení selhalo. Zkus to znovu.')
      setSaving(false)
    }
  }

  return (
    <div className="min-h-svh">
      <Topbar />
      <main className="mx-auto max-w-[480px] px-5 py-8">
        <h1 className="mb-5 text-[20px] text-[#e8e6f0]">Nový event</h1>

        <form
          onSubmit={submit}
          className="fade-up flex flex-col gap-4 rounded-[14px] border border-[#22222e] bg-[#16161f] p-[15px]"
        >
          <div>
            <label className={labelCls}>Název</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Jarní výlet Šumava"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Typ eventu</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={inputCls}
            >
              {EVENT_TYPES.map((t) => (
                <option key={t.value} value={t.value} className="bg-[#1a1a24]">
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {type === 'multi_day' && (
            <div>
              <label className={labelCls}>Počet dní</label>
              <input
                type="number"
                min={2}
                max={14}
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                className={inputCls}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Okno od</label>
              <input
                type="date"
                value={windowStart}
                onChange={(e) => setWindowStart(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Okno do</label>
              <input
                type="date"
                value={windowEnd}
                onChange={(e) => setWindowEnd(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[2, 4, 8].map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => quickWeeks(w)}
                className="rounded-[7px] border border-[#22222e] bg-[#1a1a24] px-3 py-1.5 text-[12px] text-[#b8b4d0] transition-colors hover:border-[#7c6fe0] hover:text-[#a78bfa]"
              >
                Za {w} týdny od dneška
              </button>
            ))}
          </div>

          {error && <p className="text-[13px] text-[#d84050]">{error}</p>}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-[9px] bg-[#7c6fe0] px-5 py-2.5 text-[14px] text-white transition-all hover:-translate-y-px hover:bg-[#8f84e8] disabled:opacity-60"
            >
              {saving ? 'Ukládám…' : 'Uložit'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="text-[13px] text-[#6b6880] transition-colors hover:text-[#a78bfa]"
            >
              Zrušit
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
