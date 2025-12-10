import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getEventBySlug, deleteEventById } from '../services/events'

/* format a date-only display (e.g. "Jul 14, 2025") */
const formatDateOnly = (value) =>
    value ? new Date(value).toLocaleDateString(undefined, { dateStyle: 'medium' }) : ''

/** Format time strings:
 * - If already contains AM/PM, return as-is.
 * - If "HH:MM" or "H:MM" (24h) convert to a 12-hour display "7:00 PM".
 * - Otherwise return original.
 */
function formatEventTime(time, date) {
    if (!time) return ''
    const t = String(time).trim()
    if (/(am|pm)$/i.test(t)) return t
    if (/^\d{3,4}$/.test(t)) {
        const padded = t.padStart(4, '0')
        const hh = padded.slice(0, 2)
        const mm = padded.slice(2)
        const d = new Date(`${date || '1970-01-01'}T${hh}:${mm}`)
        if (!isNaN(d)) return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true })
        return t
    }
    if (/^\d{1,2}:\d{2}$/.test(t)) {
        const d = new Date(`${date || '1970-01-01'}T${t}`)
        if (!isNaN(d)) return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true })
    }
    return t
}

export default function EventDetail() {
    const { slug } = useParams()
    const navigate = useNavigate()
    const [event, setEvent] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        let active = true
        getEventBySlug(slug)
            .then((data) => active && setEvent(data))
            .catch((err) =>
                active &&
                setError(err.response?.status === 404 ? 'Event not found' : 'Failed to load event'),
            )
            .finally(() => active && setLoading(false))
        return () => {
            active = false
        }
    }, [slug])

    const handleDelete = async () => {
        if (!window.confirm('Delete this event?')) return
        setDeleting(true)
        try {
            await deleteEventById(event._id)
            navigate('/')
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to delete event')
        } finally {
            setDeleting(false)
        }
    }

    if (loading) return <p className="text-sm text-gray-600">Loading...</p>
    if (error) return <p className="text-sm text-red-600">{error}</p>
    if (!event) return <p className="text-sm text-gray-600">Not found.</p>

    const dateDisplay = event.date ? formatDateOnly(event.date) : ''
    const timeDisplay = formatEventTime(event.time, event.date)
    const placeholder = '/thumb-images/placeholder.jpg'
    const largeImg = event.image || placeholder

    return (
        <main className="mx-auto max-w-3xl p-6 space-y-6">

            {/* Title */}
            <h1 className="text-3xl text-center font-semibold text-gray-900">{event.title}</h1>

            {/* Large image/banner */}
            <div className="w-full overflow-hidden rounded-lg bg-gray-100">
                <img
                    src={largeImg}
                    alt={event.title}
                    className="w-full object-cover"
                    style={{ maxHeight: 320 }}
                    onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = placeholder
                    }}
                />
            </div>

            {/* Description, time/date, location — stacked with even spacing */}
            <div className="space-y-4">
                {event.description && <p className="text-base text-gray-800">{event.description}</p>}

                <div className="flex flex-col items-center text-sm text-gray-800">
                    {/* time/date centered */}
                    {(timeDisplay || dateDisplay) && (
                        <p className="font-normal">
                            {timeDisplay && <span>{timeDisplay}</span>}
                            {timeDisplay && dateDisplay && <span className="mx-2">•</span>}
                            {dateDisplay && <span>{dateDisplay}</span>}
                        </p>
                    )}

                    {/* location */}
                    {event.location && <p className="mt-1 text-sm text-gray-700">{event.location}</p>}
                </div>
            </div>

            {/* Buttons centered, each half-width */}
            <div className="mt-6 flex gap-4">
                <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    title="Edit page not available yet"
                    className="w-1/2 rounded-md px-4 py-2 text-sm font-medium text-blue-700 bg-cyan-100 opacity-60 cursor-not-allowed text-center"
                >
                    Edit
                </button>
                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="w-1/2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-70"
                >
                    {deleting ? 'Deleting...' : 'Delete'}
                </button>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
        </main>
    )
}