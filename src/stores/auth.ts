import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  getToken,
  getUser,
  setTokens,
  setUser,
  clearTokens,
  authApi,
  type LoginPayload,
  type RegisterPayload,
  type ForgotPasswordPayload,
  type VerifyOtpPayload,
} from '@/services/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(getToken())
  const user = ref<ReturnType<typeof getUser>>(getUser())

  const isAuthenticated = computed(() => !!token.value)
  const currentUser = computed(() => user.value)

  function setAuth(accessToken: string, refreshToken?: string, userData?: { id: string; name: string; email: string }) {
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
    setAuth(res.access_token, res.refresh_token, res.user)
    return res
  }

  async function register(payload: RegisterPayload) {
    const res = await authApi.register(payload)
    setAuth(res.access_token, res.refresh_token, res.user)
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
