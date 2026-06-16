import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Topbar from '../components/Topbar'
import ResultsList from '../components/ResultsList'
import { getEvent } from '../lib/jsonbin'
import { rankResults } from '../lib/scoring'
import { eventTypeLabel } from '../lib/constants'

export default function ResultsPage() {
  const { id } = useParams()
  const [event, setEvent] = useState(undefined)

  useEffect(() => {
    getEvent(id).then(setEvent)
  }, [id])

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

  const results = rankResults(event)
  const respondents = Object.keys(event.availabilities || {}).length

  return (
    <div className="min-h-svh">
      <Topbar eventTitle={event.title} />

      <main className="mx-auto max-w-[560px] px-5 py-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-[20px] text-[#e8e6f0]">Výsledky</h1>
            <p className="text-[13px] text-[#6b6880]">
              {eventTypeLabel(event.type)} · {respondents} respondentů
            </p>
          </div>
          <Link
            to={`/event/${id}`}
            className="rounded-[7px] border border-[#22222e] bg-[#1a1a24] px-3 py-1.5 text-[12px] text-[#b8b4d0] transition-colors hover:border-[#7c6fe0] hover:text-[#a78bfa]"
          >
            Hlasovat
          </Link>
        </div>

        <ResultsList results={results} />
      </main>
    </div>
  )
}
