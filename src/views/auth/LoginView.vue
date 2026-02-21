<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
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
      <RouterLink to="/login" class="auth-page__brand">
      </RouterLink>

      <div class="auth-card fade-in">
        <img src="@/assets/logo.png" alt="Flash Sale" class="auth-page__logo">
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
            <input
              id="password"
              v-model="password"
              type="password"
              autocomplete="current-password"
              required
              class="auth-form__input"
              placeholder="••••••••"
            />
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
