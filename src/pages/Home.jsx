import { useEffect, useState } from 'react'
import EventList from '../components/EventList'
import EventModal from '../components/EventModal'
import { listEvents } from '../services/events'

export default function Home() {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selected, setSelected] = useState(null)

    useEffect(() => {
        let active = true
        listEvents()
            .then((data) => active && setEvents(data))
            .catch((err) => active && setError(err.message || 'Failed to load events'))
            .finally(() => active && setLoading(false))
        return () => {
            active = false
        }
    }, [])

    if (loading) return <p className="text-sm text-gray-600">Loading events...</p>
    if (error) return <p className="text-sm text-red-600">{error}</p>

    return (
        <main className="mx-auto max-w-5xl p-6 space-y-4">
            <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:items-center sm:justify-center sm:text-center">
                <h1 className="text-3xl font-semibold text-gray-900">Board Game Meetups</h1>
            </div>
            <EventList events={events} onSelect={setSelected} />
            <EventModal open={!!selected} event={selected} onClose={() => setSelected(null)} />
        </main>
    )
}