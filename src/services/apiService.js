import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('userToken'); // Changed from 'token' to 'userToken'
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor to handle auth errors globally
apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('userToken'); // Changed from 'token' to 'userToken'
            localStorage.removeItem('userData'); // Changed from 'user' to 'userData'
            // Reload the page to trigger AuthWrapper to show login
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

export const songsAPI = {
    list: () => apiClient.get('/api/songs'),
    like: (id) => apiClient.post(`/api/songs/${id}/like`),
    unlike: (id) => apiClient.post(`/api/songs/${id}/unlike`)
};

export const albumsAPI = {
    list: () => apiClient.get('/api/albums'),
    like: (id) => apiClient.post(`/api/albums/${id}/like`),
    unlike: (id) => apiClient.post(`/api/albums/${id}/unlike`),
    updateSubscription: (id, plan) => apiClient.put(`/api/albums/${id}/subscription`, { plan })
};

export const subscriptionAPI = {
    subscribe: (plan) => apiClient.post('/api/subscription/subscribe', { plan }),
    getStatus: () => apiClient.get('/api/subscription/status')
};

export const userAPI = {
    getRecentTracks: () => apiClient.get('/api/user/recent-tracks'),
    addRecentTrack: (songId) => apiClient.post('/api/user/recent-tracks', { songId })
};

export const commentsAPI = {
    list: (songId) => apiClient.get(`/api/songs/${songId}/comments`),
    add: (songId, comment) => apiClient.post(`/api/songs/${songId}/comments`, comment)
};

export default apiClient;