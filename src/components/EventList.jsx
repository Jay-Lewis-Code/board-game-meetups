import Event from './Event'

export default function EventList({ events = [], onSelect }) {
    if (!events.length) return <p className="text-sm text-gray-600">No events yet.</p>

    return (
        <ul className="space-y-4">
            {events.map((event) => (
                <Event key={event._id || event.slug || event.title} event={event} onSelect={onSelect} />
            ))}
        </ul>
    )
}
