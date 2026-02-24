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

/** Build a single message from backend error body (supports message + Laravel-style errors). */
function getErrorMessage(
  status: number | undefined,
  data: { message?: string; errors?: Record<string, string[]> } | undefined
): string {
  if (data?.message && typeof data.message === 'string') return data.message
  if (data?.errors && typeof data.errors === 'object') {
    const parts = Object.entries(data.errors).flatMap(([field, msgs]) =>
      Array.isArray(msgs) ? msgs.map((m) => `${field}: ${m}`) : []
    )
    if (parts.length) return parts.join('. ')
  }
  if (status === 401) return 'Session expired, please sign in again'
  if (status && status >= 500) return 'Server error. Please try again later or check that the backend is running.'
  return 'Request failed'
}

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>) => {
    if (error.response?.status === 401 && localStorage.getItem(TOKEN_KEY)) {
      clearAuthStorage()
      window.dispatchEvent(new CustomEvent('session-expired'))
    }
    const message = getErrorMessage(error.response?.status, error.response?.data)
    throw new Error(message)
  }
)
