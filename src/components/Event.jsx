import { Link } from 'react-router-dom'

/* format a date-only display (e.g. "Jul 14, 2025") */
const formatDateOnly = (value) =>
    value ? new Date(value).toLocaleDateString(undefined, { dateStyle: 'medium' }) : ''

/** Format time strings to a human-friendly 12-hour display.
 *  Accepts "HH:MM" (24h), "0700" and already-formatted "7:00 PM".
 *  Params:
 *    - time (string): stored event.time value
 *    - date (string): optional date used to build an ISO time for Date parsing
 *  Returns:
 *    - string: human-friendly time like "7:00 PM" or original input if unparseable
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

// Placeholder image to prevent missing or broken image from breaking the styling
const placeholder ='/thumb-images/placeholder.jpg'

export default function Event({ event, onSelect }) {
    if (!event) return null

    const thumb = event.imageSmall || event.image || placeholder
    const dateDisplay = event.date ? formatDateOnly(event.date) : ''
    const timeDisplay = formatEventTime(event.time, event.date)

    const handleActivate = () => {
        if (onSelect) onSelect(event)
    }

    const handleKeyDown = (e) => {
        if (!onSelect) return
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSelect(event)
        }
    }

    return (
        <li>
            <div
                role="button"
                tabIndex={0}
                onClick={handleActivate}
                onKeyDown={handleKeyDown}
                className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
                <div className="h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-gray-200">
                    <img
                        src={thumb}
                        alt={event.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                            e.currentTarget.onerror = null
                            e.currentTarget.src = placeholder
                        }}
                    />
                </div>

                <div className="flex flex-1 flex-col">
                    <h2 className="text-lg font-semibold text-gray-900">{event.title}</h2>
                    {event.description && (
                        <p className="mt-1 text-sm text-gray-700 line-clamp-2">{event.description}</p>
                    )}
                    {(timeDisplay || dateDisplay) && (
                        <p className="text-sm text-gray-700">
                            {timeDisplay && <span>{timeDisplay}</span>}
                            {timeDisplay && dateDisplay && <span className="mx-2">•</span>}
                            {dateDisplay && <span>{dateDisplay}</span>}
                        </p>
                    )}
                    {event.location && <p className="text-sm font-medium text-gray-800">{event.location}</p>}

                </div>
            </div>
        </li>
    )
}