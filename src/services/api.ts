import axios, { type AxiosError } from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? ''
/** Key for access_token stored after login (response.access_token). */
const TOKEN_KEY = 'token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_KEY = 'user'

/** Clear token and user from localStorage on 401 (avoids circular import to auth). */
function clearAuthStorage() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(TOKEN_KEY)
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401 && localStorage.getItem(TOKEN_KEY)) {
      clearAuthStorage()
      window.dispatchEvent(new CustomEvent('session-expired'))
    }
    const status = error.response?.status
    const serverMessage = error.response?.data?.message
    const message =
      serverMessage ??
      (status === 401
        ? 'Session expired, please sign in again'
        : status && status >= 500
          ? 'Server error. Please try again later or check that the backend is running.'
          : 'Request failed')
    throw new Error(message)
  }
)
