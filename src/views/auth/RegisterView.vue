<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
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
      <RouterLink to="/login" class="auth-page__brand">
        <span class="auth-page__logo">Flash Sale</span>
      </RouterLink>

      <div class="auth-card fade-in">
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
            <input
              id="password"
              v-model="password"
              type="password"
              autocomplete="new-password"
              required
              minlength="8"
              class="auth-form__input"
              :class="{ 'auth-form__input--error': passwordConfirmation && !passwordsMatch }"
              placeholder="At least 8 characters"
            />
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
