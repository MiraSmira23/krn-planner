const BIN_ID = import.meta.env.VITE_JSONBIN_BIN_ID
const API_KEY = import.meta.env.VITE_JSONBIN_API_KEY
const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`

const EMPTY = { events: {} }

export async function readData() {
  try {
    const res = await fetch(`${BASE_URL}/latest`, {
      headers: { 'X-Master-Key': API_KEY },
    })
    if (!res.ok) throw new Error(`JSONBin read failed: ${res.status}`)
    const json = await res.json()
    const record = json.record
    if (!record || typeof record !== 'object' || !record.events) {
      return { ...EMPTY }
    }
    return record
  } catch (err) {
    console.error('readData error', err)
    return { ...EMPTY }
  }
}

export async function writeData(data) {
  const res = await fetch(BASE_URL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': API_KEY,
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`JSONBin write failed: ${res.status}`)
  return res.json()
}

// ---- Higher-level helpers (read -> modify -> write) ----

export async function getEvent(eventId) {
  const data = await readData()
  return data.events?.[eventId] ?? null
}

export async function createEvent(event) {
  const data = await readData()
  if (!data.events) data.events = {}
  data.events[event.id] = event
  await writeData(data)
  return event
}

export async function deleteEvent(eventId) {
  const data = await readData()
  if (data.events) delete data.events[eventId]
  await writeData(data)
}

export async function saveAvailability(eventId, name, days) {
  const data = await readData()
  const event = data.events?.[eventId]
  if (!event) throw new Error('Event nenalezen')
  if (!event.availabilities) event.availabilities = {}
  event.availabilities[name] = days
  await writeData(data)
}
