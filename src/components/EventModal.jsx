import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'

/* format a date-only display (e.g. "Jul 14, 2025") */
const formatDateOnly = (value) =>
    value ? new Date(value).toLocaleDateString(undefined, { dateStyle: 'medium' }) : ''

const placeholder = '/thumb-images/placeholder.jpg'

export default function EventModal({ open, onClose, event }) {
    if (!open || !event) return null

    const modalImg = event.modalImage || event.image || placeholder
    const dateDisplay = event.date ? formatDateOnly(event.date) : ''
    const timeDisplay = event.time || ''
    const containerRef = useRef(null)

    useEffect(() => {
        if (!open) return
        const onKey = (e) => {
            if (e.key === 'Escape') onClose?.()
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [open, onClose])

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onClose?.()
    }

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={handleOverlayClick}
            role="dialog"
            aria-modal="true"
        >
            <div
                ref={containerRef}
                className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl" /* slightly smaller modal (max-w-lg) */
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-end">
                    <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>

                <div className="space-y-3 text-center">
                    <h3 className="text-2xl font-semibold text-gray-900">{event.title}</h3>
                    {event.description && <p className="text-sm text-gray-800">{event.description}</p>}

                    {/* date, time, and location text */}
                    <div className="mt-1 space-y-1">
                        {(timeDisplay || dateDisplay) && (
                            <p className="text-sm text-gray-700">
                                {timeDisplay && <span>{timeDisplay}</span>}
                                {timeDisplay && dateDisplay && <span className="mx-2">•</span>}
                                {dateDisplay && <span>{dateDisplay}</span>}
                            </p>
                        )}
                        {event.location && <p className="text-sm font-medium text-gray-800">{event.location}</p>}
                    </div>

                    {modalImg && (
                        <div className="mx-auto mt-3 overflow-hidden rounded-xl bg-gray-100">
                            <img
                                src={modalImg}
                                alt={event.title}
                                className="h-48 w-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.onerror = null
                                    e.currentTarget.src = placeholder
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* centered buttons, each takes half of modal width */}
                <div className="mt-6 flex gap-4 justify-center">
                    <button
                        onClick={onClose}
                        className="w-1/2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        Close
                    </button>
                    <Link
                        to={`/events/${event.slug}`}
                        onClick={(e) => {
                            e.stopPropagation()
                        }}
                        className="w-1/2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 text-center"
                    >
                        More Information
                    </Link>
                </div>
            </div>
        </div>,
        document.body,
    )
}
