import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createEvent } from '../services/events'

export default function CreateEvent() {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        title: '',
        image: '',
        imageSmall: '',
        modalImage: '',
        location: '',
        date: '',       // date only
        time: '',       // start time (e.g., 07:30 or 07:30 AM/PM via browser UI)
        description: '',
    })
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((f) => ({ ...f, [name]: value }))
    }
    /*
        * Helper Function to12Hour(time)
        *
        * Convert the time string into a 12-hour, human-friendly display string.
        *
        * Purpose:
        * - Browser <input type="time"> yields "HH:MM" (24-hour). We want to store/display "h:MM AM/PM".
        *
        * Parameter:
        * - time (string) : the input time value. Examples:
        *     "17:30"    -> converted to "5:30 PM"
        *     "07:00"    -> converted to "7:00 AM"
        *     "7:00 PM"  -> returned as-is (function is idempotent for already formatted values)
        *
        * Returns:
        * - string : a locale-formatted 12-hour time like "5:30 PM", or the original input if parsing fails.
    */
    function to12Hour(time) {
        if (!time) return ''
        const t = time.trim()
        if (/(am|pm)$/i.test(t)) return t // already friendly
        const [hh, mm] = t.split(':').map((s) => parseInt(s, 10))
        if (Number.isNaN(hh) || Number.isNaN(mm)) return time
        const d = new Date()
        d.setHours(hh, mm, 0, 0)
        return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setError(null)
        try {
            // convert time (e.g. "17:00") -> "5:00 PM" before sending
            const payload = { ...form, time: to12Hour(form.time) }
            await createEvent(payload)
            navigate('/')
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to create event')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main className="mx-auto max-w-3xl p-6 space-y-4">
            <h1 className="text-2xl font-semibold text-gray-900 text-center">Create Event</h1>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-800">Title</label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-800">Large Image URL</label>
                    <input
                        name="image"
                        value={form.image}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-800">Small Image URL (list thumbnail)</label>
                    <input
                        name="imageSmall"
                        value={form.imageSmall}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-800">Modal Image URL (map screenshot)</label>
                    <input
                        name="modalImage"
                        value={form.modalImage}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-800">Location</label>
                    <input
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-800">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-800">Start Time</label>
                        <input
                            type="time"
                            name="time"
                            value={form.time}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-800">Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={4}
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-70"
                >
                    {submitting ? 'Creating...' : 'Create event'}
                </button>
            </form>
        </main>
    )
}