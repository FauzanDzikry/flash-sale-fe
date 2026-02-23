import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  getToken,
  getUser,
  setTokens,
  setUser,
  clearTokens,
  normalizeUser,
  authApi,
  type LoginPayload,
  type RegisterPayload,
  type ForgotPasswordPayload,
  type VerifyOtpPayload,
  type StoredUser,
} from '@/services/auth'

export const useAuthStore = defineStore('auth', () => {
  // Inisialisasi dari localStorage agar "Welcome, {name}" tampil benar setelah reload
  const token = ref<string | null>(getToken())
  const user = ref<ReturnType<typeof getUser>>(getUser())

  const isAuthenticated = computed(() => !!token.value)
  const currentUser = computed(() => user.value)

  function setAuth(accessToken: string, refreshToken?: string, userData?: StoredUser | null) {
    setTokens(accessToken, refreshToken)
    token.value = accessToken
    if (userData) {
      setUser(userData)
      user.value = userData
    } else {
      user.value = getUser()
    }
  }

  function logout() {
    clearTokens()
    token.value = null
    user.value = null
  }

  async function login(payload: LoginPayload) {
    const res = await authApi.login(payload)
    // Simpan id, name, email dari response.user (bukan hanya email)
    const userData = normalizeUser(res.user, payload.email)
    setAuth(res.access_token, res.refresh_token, userData)
    return res
  }

  async function register(payload: RegisterPayload) {
    const res = await authApi.register(payload)
    // Simpan id, name, email dari response.user
    const userData = normalizeUser(res.user, payload.email)
    setAuth(res.access_token, res.refresh_token, userData)
    return res
  }

  async function forgotPassword(payload: ForgotPasswordPayload) {
    return authApi.forgotPassword(payload)
  }

  async function verifyOtpResetPassword(payload: VerifyOtpPayload) {
    return authApi.verifyOtp(payload)
  }

  return {
    token,
    user,
    isAuthenticated,
    currentUser,
    setAuth,
    logout,
    login,
    register,
    forgotPassword,
    verifyOtpResetPassword,
  }
})
