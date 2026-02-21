<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)

async function onSubmit() {
  error.value = ''
  success.value = ''
  if (!email.value) {
    error.value = 'Email is required.'
    return
  }
  loading.value = true
  try {
    await auth.forgotPassword({ email: email.value })
    success.value = 'OTP code has been sent to your email. Check your inbox or spam.'
    setTimeout(() => {
      router.push({ name: 'verify-otp', query: { email: email.value } })
    }, 2500)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to send. Check your email and try again.'
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
        <span class="auth-page__logo">Flash Sale</span>
      </RouterLink>

      <div class="auth-card fade-in">
        <h1 class="auth-card__title">Forgot password?</h1>
        <p class="auth-card__subtitle">
          Enter your email and we'll send you an OTP code to reset your password.
        </p>

        <form @submit.prevent="onSubmit" class="auth-form">
          <Transition name="slide-fade" mode="out-in">
            <p v-if="error" key="error" class="auth-form__error">
              {{ error }}
            </p>
            <p v-else-if="success" key="success" class="auth-form__success">
              {{ success }}
              <RouterLink
                :to="{ name: 'verify-otp', query: { email } }"
                class="auth-form__link block mt-2 font-semibold"
              >
                Continue to OTP verification →
              </RouterLink>
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
          <button type="submit" :disabled="loading" class="auth-form__submit fade-in fade-in-delay-2">
            {{ loading ? 'Sending...' : 'Send OTP code' }}
          </button>
        </form>

        <p class="auth-card__footer fade-in fade-in-delay-3">
          <RouterLink to="/login" class="auth-form__link">← Back to login</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-form__success {
  padding: 0.75rem 1rem;
  background: #e9f3f9;
  color: #1a6396;
  font-size: 0.875rem;
  border-radius: 0.75rem;
  border: 1px solid #a7d1ed;
}
</style>
