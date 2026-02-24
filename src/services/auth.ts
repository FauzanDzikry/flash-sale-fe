import { api } from './api'

const TOKEN_KEY = 'token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_KEY = 'user'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  password_confirmation: string
}

/** User object stored in frontend: always id, name, email. */
export interface StoredUser {
  id: string
  name: string
  email: string
}

/** Login/register response from backend: uses access_token and user object. */
export interface AuthResponse {
  access_token: string
  refresh_token?: string
  token_type: string
  expires_in?: number
  user: {
    id?: string | number
    name?: string
    email?: string
    [key: string]: unknown
  }
}

export interface ForgotPasswordPayload {
  email: string
}

export interface VerifyOtpPayload {
  email: string
  otp: string
  password: string
  password_confirmation: string
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

/** Store access_token (and optional refresh_token) from login response. */
export function setTokens(accessToken: string, refreshToken?: string): void {
  localStorage.setItem(TOKEN_KEY, accessToken)
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  }
}

export function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

/** Normalize backend user object to { id, name, email } for frontend storage. Supports alternate keys (user_id, full_name). */
export function normalizeUser(
  resUser: AuthResponse['user'] | null | undefined,
  fallbackEmail = ''
): StoredUser {
  if (!resUser || typeof resUser !== 'object') {
    return { id: '', name: '', email: fallbackEmail || '' }
  }
  const r = resUser as Record<string, unknown>
  const id =
    resUser.id != null
      ? String(resUser.id)
      : r.user_id != null
        ? String(r.user_id)
        : ''
  const name =
    typeof resUser.name === 'string'
      ? resUser.name.trim()
      : typeof r.full_name === 'string'
        ? String(r.full_name).trim()
        : ''
  const email = typeof resUser.email === 'string' ? resUser.email.trim() : fallbackEmail.trim()
  return {
    id,
    name,
    email: email || fallbackEmail || '',
  }
}

/** Store user object (id, name, email) from login/register response to localStorage. */
export function setUser(user: StoredUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getUser(): StoredUser | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>
    return {
      id: typeof parsed?.id === 'string' ? parsed.id : String(parsed?.id ?? ''),
      name: typeof parsed?.name === 'string' ? parsed.name : '',
      email: typeof parsed?.email === 'string' ? parsed.email : '',
    }
  } catch {
    return null
  }
}

/** Unwrap if backend returns { data: AuthResponse }. Get user from body.user or body.data?.user. */
function unwrapAuthResponse(body: AuthResponse | { data: AuthResponse }): AuthResponse {
  const raw = body as { data?: AuthResponse; user?: AuthResponse['user'] }
  const base =
    raw?.data && typeof raw.data.access_token !== 'undefined' ? raw.data : (body as AuthResponse)
  const user =
    base.user ??
    (body as Record<string, unknown>).user ??
    (raw?.data as unknown as Record<string, unknown>)?.user
  return { ...base, user: user ?? {} }
}

export const authApi = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse | { data: AuthResponse }>('/auth/login', payload)
    return unwrapAuthResponse(data)
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse | { data: AuthResponse }>('/auth/register', payload)
    return unwrapAuthResponse(data)
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<{ message: string }> {
    const { data } = await api.post<{ message: string }>('/auth/forgot-password', payload)
    return data
  },

  async verifyOtp(payload: VerifyOtpPayload): Promise<{ message: string }> {
    const { data } = await api.post<{ message: string }>('/auth/verify-otp-reset-password', payload)
    return data
  },
}
