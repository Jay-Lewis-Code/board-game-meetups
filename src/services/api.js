import axios from 'axios';

const api = axios.create({
    // TODO: Change this to Node/Express API base URL (FullStack CTF)
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
    withCredentials: false,
});

export default api;