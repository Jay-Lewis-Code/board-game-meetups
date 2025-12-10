import api from './api'

export async function listEvents() {
    const { data } = await api.get('/events')
    return data
}

export async function getEventBySlug(slug) {
    const { data } = await api.get(`/events/slug/${slug}`)
    return data
}

export async function createEvent(payload) {
    const { data } = await api.post('/events', payload)
    return data
}

export async function deleteEventById(id) {
    const safe = encodeURIComponent(id)
    const { data } = await api.delete(`/events/${safe}`)
    return data
}