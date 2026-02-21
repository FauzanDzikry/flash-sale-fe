<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const otp = ref(['', '', '', '', '', ''])
const password = ref('')
const passwordConfirmation = ref('')
const error = ref('')
const loading = ref(false)
const otpString = computed(() => otp.value.join(''))
const passwordsMatch = computed(() => password.value === passwordConfirmation.value)

onMounted(() => {
  const q = route.query.email
  email.value = typeof q === 'string' ? q : (Array.isArray(q) ? q[0] : '') ?? ''
})

function focusNext(index: number, event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value
  if (value && index < 5) {
    const next = target.nextElementSibling as HTMLInputElement | null
    next?.focus()
  }
}

function focusPrev(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace' && !(event.target as HTMLInputElement).value && index > 0) {
    const prev = (event.target as HTMLInputElement).previousElementSibling as HTMLInputElement | null
    prev?.focus()
  }
}

async function onSubmit() {
  error.value = ''
  if (!email.value) {
    error.value = 'Email not found. Start again from forgot password.'
    return
  }
  if (otpString.value.length !== 6) {
    error.value = 'Enter the 6-digit OTP code.'
    return
  }
  if (!password.value || !passwordConfirmation.value) {
    error.value = 'Password and confirmation are required.'
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
    await auth.verifyOtpResetPassword({
      email: email.value,
      otp: otpString.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    })
    router.push({ name: 'login' })
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Invalid or expired OTP. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-page__bg" />
    <div class="auth-page__content auth-page__content--wide">
      <RouterLink to="/login" class="auth-page__brand">
        <span class="auth-page__logo">Flash Sale</span>
      </RouterLink>

      <div class="auth-card fade-in">
        <h1 class="auth-card__title">Verify OTP</h1>
        <p class="auth-card__subtitle">
          Enter the 6-digit code sent to <strong>{{ email || 'your email' }}</strong> and set a new password.
        </p>

        <form @submit.prevent="onSubmit" class="auth-form">
          <Transition name="slide-fade" mode="out-in">
            <p v-if="error" key="error" class="auth-form__error">
              {{ error }}
            </p>
          </Transition>

          <div class="auth-form__field fade-in fade-in-delay-1">
            <label class="auth-form__label">OTP code</label>
            <div class="auth-form__otp">
              <input
                v-for="(digit, index) in otp"
                :key="index"
                v-model="otp[index]"
                type="text"
                inputmode="numeric"
                maxlength="1"
                class="auth-form__otp-input"
                @input="focusNext(index, $event)"
                @keydown="focusPrev(index, $event)"
              />
            </div>
          </div>
          <div class="auth-form__field fade-in fade-in-delay-2">
            <label for="password" class="auth-form__label">New password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              autocomplete="new-password"
              required
              minlength="8"
              class="auth-form__input"
              placeholder="At least 8 characters"
            />
          </div>
          <div class="auth-form__field fade-in fade-in-delay-3">
            <label for="password_confirmation" class="auth-form__label">Confirm new password</label>
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
          <button type="submit" :disabled="loading" class="auth-form__submit fade-in fade-in-delay-4">
            {{ loading ? 'Resetting...' : 'Reset password' }}
          </button>
        </form>

        <p class="auth-card__footer fade-in fade-in-delay-5">
          <RouterLink to="/forgot-password" class="auth-form__link">Resend OTP code</RouterLink>
          <span class="mx-2 text-slate-300">·</span>
          <RouterLink to="/login" class="auth-form__link">Back to login</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page__content--wide {
  max-width: 32rem;
}
.auth-form__otp {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}
.auth-form__otp-input {
  width: 2.75rem;
  height: 3rem;
  text-align: center;
  font-size: 1.25rem;
  font-weight: 600;
  border: 1px solid #a7d1ed;
  border-radius: 0.75rem;
  background: #f8fafc;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}
.auth-form__otp-input:hover {
  background: white;
}
.auth-form__otp-input:focus {
  outline: none;
  border-color: #2482c2;
  box-shadow: 0 0 0 3px rgba(36, 130, 194, 0.2);
  background: white;
}
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
</style>
