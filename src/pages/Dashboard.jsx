import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Topbar from '../components/Topbar'
import EventCard from '../components/EventCard'
import { readData, deleteEvent } from '../lib/jsonbin'
import { logout } from '../lib/auth'

export default function Dashboard() {
  const navigate = useNavigate()
  const [events, setEvents] = useState(null)

  useEffect(() => {
    readData().then((data) => {
      const list = Object.values(data.events || {}).sort(
        (a, b) => (b.created_at || '').localeCompare(a.created_at || '')
      )
      setEvents(list)
    })
  }, [])

  async function handleDelete(event) {
    if (!confirm(`Smazat event „${event.title}"?`)) return
    await deleteEvent(event.id)
    setEvents((prev) => prev.filter((e) => e.id !== event.id))
  }

  return (
    <div className="min-h-svh">
      <Topbar
        right={
          <button
            type="button"
            onClick={() => {
              logout()
              navigate('/')
            }}
            className="text-[12px] text-[#6b6880] transition-colors hover:text-[#a78bfa]"
          >
            Odhlásit
          </button>
        }
      />

      <main className="mx-auto max-w-[680px] px-5 py-8">
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-[20px] text-[#e8e6f0]">Eventy</h1>
          <Link
            to="/dashboard/new"
            className="rounded-[9px] bg-[#7c6fe0] px-4 py-2 text-[13px] text-white transition-all hover:-translate-y-px hover:bg-[#8f84e8]"
          >
            Nový event
          </Link>
        </div>

        {events === null ? (
          <p className="text-[14px] text-[#6b6880]">Načítám…</p>
        ) : events.length === 0 ? (
          <p className="text-[14px] text-[#6b6880]">
            Zatím žádné eventy. Vytvoř první.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
