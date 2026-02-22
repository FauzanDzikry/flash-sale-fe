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

export interface AuthResponse {
  access_token: string
  refresh_token?: string
  token_type: string
  expires_in?: number
  user: {
    id: string
    name: string
    email: string
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

export function setUser(user: AuthResponse['user']): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getUser(): AuthResponse['user'] | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthResponse['user']
  } catch {
    return null
  }
}

/** Unwrap jika backend mengembalikan { data: AuthResponse }. */
function unwrapAuthResponse(body: AuthResponse | { data: AuthResponse }): AuthResponse {
  const raw = body as { data?: AuthResponse }
  return raw?.data && typeof raw.data.access_token !== 'undefined' ? raw.data : (body as AuthResponse)
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
