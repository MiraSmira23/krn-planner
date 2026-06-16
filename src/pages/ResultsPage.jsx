import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Topbar from '../components/Topbar'
import ResultsList from '../components/ResultsList'
import { getEvent } from '../lib/jsonbin'
import { rankResults } from '../lib/scoring'

export default function ResultsPage() {
  const { id } = useParams()
  const [event, setEvent] = useState(undefined)
  const [results, setResults] = useState([])

  useEffect(() => {
    getEvent(id).then((ev) => {
      setEvent(ev)
      if (ev) setResults(rankResults(ev))
    })
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

  return (
    <div className="min-h-svh">
      <Topbar eventTitle={event.title} />

      <main className="mx-auto max-w-[600px] px-5 py-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-[20px] text-[#e8e6f0]">Výsledky</h1>
            <p className="text-[13px] text-[#6b6880]">
              {Object.keys(event.availabilities || {}).length} respondentů
            </p>
          </div>
          <Link
            to={`/event/${id}`}
            className="text-[13px] text-[#a78bfa] transition-colors hover:text-[#c4b5fd]"
          >
            ← Hlasovat
          </Link>
        </div>

        <ResultsList results={results} />
      </main>
    </div>
  )
}
