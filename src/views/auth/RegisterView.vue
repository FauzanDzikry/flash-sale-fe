<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import logo from '@/assets/logo.png'
import logoWhite from '@/assets/logo-white.png'

const router = useRouter()
const auth = useAuthStore()
const theme = useThemeStore()
const logoSrc = computed(() => (theme.isDark ? logoWhite : logo))

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const showPassword = ref(false)
const error = ref('')
const loading = ref(false)
const passwordsMatch = computed(() => password.value === passwordConfirmation.value)

async function onSubmit() {
  error.value = ''
  if (!name.value || !email.value || !password.value || !passwordConfirmation.value) {
    error.value = 'All fields are required.'
    return
  }
  if (!passwordsMatch.value) {
    error.value = 'Password and confirmation do not match.'
    return
  }
  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters.'
    return
  }
  loading.value = true
  try {
    await auth.register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    })
    router.push({ name: 'home' })
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Registration failed. Please try again.'
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
        <img :src="logoSrc" alt="Flash Sale" class="auth-page__logo">
      </RouterLink>
        <h1 class="auth-card__title">Create account</h1>
        <p class="auth-card__subtitle">Join Flash Sale and start saving today</p>

        <form @submit.prevent="onSubmit" class="auth-form">
          <Transition name="slide-fade" mode="out-in">
            <p v-if="error" key="error" class="auth-form__error">
              {{ error }}
            </p>
          </Transition>

          <div class="auth-form__field fade-in fade-in-delay-1">
            <label for="name" class="auth-form__label">Name</label>
            <input
              id="name"
              v-model="name"
              type="text"
              autocomplete="name"
              required
              class="auth-form__input"
              placeholder="Full name"
            />
          </div>
          <div class="auth-form__field fade-in fade-in-delay-2">
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
          <div class="auth-form__field fade-in fade-in-delay-3">
            <label for="password" class="auth-form__label">Password</label>
            <div class="auth-form__password-wrap">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                required
                minlength="8"
                class="auth-form__input auth-form__input--with-toggle"
                :class="{ 'auth-form__input--error': passwordConfirmation && !passwordsMatch }"
                placeholder="At least 8 characters"
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
          <div class="auth-form__field fade-in fade-in-delay-4">
            <label for="password_confirmation" class="auth-form__label">Confirm password</label>
            <input
              id="password_confirmation"
              v-model="passwordConfirmation"
              type="password"
              autocomplete="new-password"
              required
              class="auth-form__input"
              :class="{ 'auth-form__input--error': passwordConfirmation && !passwordsMatch }"
              placeholder="Repeat password"
            />
            <p v-if="passwordConfirmation && !passwordsMatch" class="auth-form__hint auth-form__hint--error">
              Passwords do not match
            </p>
          </div>
          <button type="submit" :disabled="loading" class="auth-form__submit fade-in fade-in-delay-5">
            {{ loading ? 'Creating account...' : 'Create account' }}
          </button>
        </form>

        <p class="auth-card__footer fade-in fade-in-delay-5">
          Already have an account?
          <RouterLink to="/login" class="auth-form__link font-semibold">Sign in</RouterLink>
        </p>
      </div>

      <p class="auth-page__back">
        <RouterLink to="/login" class="auth-form__link">← Back to login</RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-form__input--error {
  border-color: #f87171;
}
.auth-form__hint {
  font-size: 0.75rem;
  margin-top: 0.25rem;
}
.auth-form__hint--error {
  color: #dc2626;
}
.auth-page__back {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
}
</style>
