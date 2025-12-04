import axios from 'axios'
import {BASE_URL} from './apiPaths'

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
})

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('token')
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },
    (e) => {
        return Promise.reject(e)
    }
)

axiosInstance.interceptors.response.use(
    (response) => {
        return response
    },
    (e) => {
        if (e.response) {
            if (e.response.status === 401) {
                window.location.href = '/login'
            } else if (e.response.status === 500) {
                console.error('Server error)')
            }
        } else if (e.code === 'ECONNABORTED') {
            console.error('Request timeout')
        }
        return Promise.reject(e)
    }
)

export default axiosInstance