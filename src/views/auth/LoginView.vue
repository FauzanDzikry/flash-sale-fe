<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import Modal from '@/components/Modal.vue'
import logo from '@/assets/logo.png'
import logoWhite from '@/assets/logo-white.png'

const SUCCESS_MODAL_DURATION_MS = 1000

const auth = useAuthStore()
const theme = useThemeStore()
const logoSrc = computed(() => (theme.isDark ? logoWhite : logo))

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const error = ref('')
const loading = ref(false)
const showSuccessModal = ref(false)
const showErrorModal = ref(false)

function closeErrorModal() {
  showErrorModal.value = false
}

async function onSubmit() {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'Email and password are required.'
    return
  }
  loading.value = true
  try {
    await auth.login({ email: email.value, password: password.value })
    showSuccessModal.value = true
    setTimeout(() => {
      showSuccessModal.value = false
      window.location.replace('/')
    }, SUCCESS_MODAL_DURATION_MS)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Login failed. Please check your email and password.'
    showErrorModal.value = true
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

    <Modal
      :show="showSuccessModal"
      title="Login berhasil"
      :close-on-overlay="false"
      @close="showSuccessModal = false"
    >
      <div class="success-modal">
        <div class="success-modal__icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="success-modal__text">Login successful. Redirecting to home page...</p>
      </div>
    </Modal>

    <Modal
      :show="showErrorModal"
      title="Login failed"
      :close-on-overlay="true"
      @close="closeErrorModal"
    >
      <div class="error-modal">
        <div class="error-modal__icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 class="error-modal__title">Login failed</h2>
        <p class="error-modal__text">{{ error }}</p>
      </div>
    </Modal>
  </div>
</template>

<style scoped>
.success-modal {
  text-align: center;
  padding: 0.5rem 0;
}
.success-modal__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  background: #dcfce7;
  color: #16a34a;
  margin: 0 auto 1rem;
}
.dark .success-modal__icon {
  background: #14532d;
  color: #86efac;
}
.success-modal__icon svg {
  width: 1.75rem;
  height: 1.75rem;
}
.success-modal__text {
  font-size: 0.9375rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}
.dark .success-modal__text {
  color: #94a3b8;
}

.error-modal {
  text-align: center;
  padding: 0.5rem 0;
}
.error-modal__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  background: #fee2e2;
  color: #dc2626;
  margin-bottom: 1rem;
}
.error-modal__icon svg {
  width: 1.75rem;
  height: 1.75rem;
}
.dark .error-modal__icon {
  background: #7f1d1d;
  color: #fca5a5;
}
.error-modal__title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 0.5rem;
}
.dark .error-modal__title {
  color: #e2e8f0;
}
.error-modal__text {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 1.5rem;
  line-height: 1.5;
}
.dark .error-modal__text {
  color: #94a3b8;
}
</style>
