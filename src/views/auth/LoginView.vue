<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const error = ref('')
const loading = ref(false)

async function onSubmit() {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'Email and password are required.'
    return
  }
  loading.value = true
  try {
    await auth.login({ email: email.value, password: password.value })
    router.push({ name: 'home' })
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Login failed. Check your email and password.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-page__bg" />
    <div class="auth-page__content">

      <div class="auth-card fade-in">
        <RouterLink to="/login" class="auth-page__brand">
        <img src="@/assets/logo.png" alt="Flash Sale" class="auth-page__logo">
      </RouterLink>
        <h1 class="auth-card__title">Welcome back</h1>
        <p class="auth-card__subtitle">Sign in to your account to continue</p>

        <form @submit.prevent="onSubmit" class="auth-form">
          <Transition name="slide-fade" mode="out-in">
            <p v-if="error" key="error" class="auth-form__error">
              {{ error }}
            </p>
          </Transition>

          <div class="auth-form__field fade-in fade-in-delay-1">
            <label for="email" class="auth-form__label">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              required
              class="auth-form__input"
              placeholder="you@example.com"
            />
          </div>
          <div class="auth-form__field fade-in fade-in-delay-2">
            <label for="password" class="auth-form__label">Password</label>
            <div class="auth-form__password-wrap">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                class="auth-form__input auth-form__input--with-toggle"
                placeholder="••••••••"
              />
              <button
                type="button"
                class="auth-form__password-toggle"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                @click="showPassword = !showPassword"
              >
                <svg v-if="showPassword" class="auth-form__toggle-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <svg v-else class="auth-form__toggle-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>
          <div class="auth-form__field fade-in fade-in-delay-3 text-right">
            <RouterLink to="/forgot-password" class="auth-form__link">
              Forgot password?
            </RouterLink>
          </div>
          <button
            type="submit"
            :disabled="loading"
            class="auth-form__submit fade-in fade-in-delay-4"
          >
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>

        <p class="auth-card__footer fade-in fade-in-delay-5">
          Don't have an account?
          <RouterLink to="/register" class="auth-form__link font-semibold">Create one</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
