<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const theme = useThemeStore()

function handleLogout() {
  auth.logout()
  router.push({ name: 'login' })
}

const isAuthPage = computed(() => {
  const name = route.name
  return name === 'login' || name === 'register' || name === 'forgot-password' || name === 'verify-otp'
})

const showNavbar = computed(() => !isAuthPage.value)
</script>

<template>
  <div class="min-h-screen font-sans">
    <header
      v-show="showNavbar"
      class="app-header sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur transition-all duration-300"
    >
      <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:py-4">
        <RouterLink
          :to="auth.isAuthenticated ? '/' : '/login'"
          class="app-header__brand text-base font-bold text-slate-800 transition hover:text-primary sm:text-lg"
        >
          Flash Sale
        </RouterLink>
        <nav class="flex flex-wrap items-center gap-2 sm:gap-4">
          <template v-if="!auth.isAuthenticated">
            <RouterLink
              to="/login"
              class="rounded-lg px-3 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              active-class="router-link-active bg-slate-100 font-medium text-slate-900"
            >
              Login
            </RouterLink>
            <RouterLink
              to="/register"
              class="app-header__btn-primary rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-primary-hover hover:shadow-lg"
              active-class="ring-2 ring-primary ring-offset-2"
            >
              Register
            </RouterLink>
          </template>
          <template v-else>
            <RouterLink
              to="/"
              class="rounded-lg px-3 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              active-class="router-link-active bg-slate-100 font-medium text-slate-900"
            >
              Home
            </RouterLink>
            <RouterLink
              to="/about"
              class="rounded-lg px-3 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              active-class="router-link-active bg-slate-100 font-medium text-slate-900"
            >
              About
            </RouterLink>
            <span class="app-header__user px-3 py-2 text-slate-600">{{ auth.currentUser?.name }}</span>
            <button
              type="button"
              class="app-header__btn-logout rounded-lg px-3 py-2 text-slate-600 transition hover:bg-red-50 hover:text-red-600"
              @click="handleLogout"
            >
              Log out
            </button>
          </template>
          <button
            type="button"
            class="theme-toggle"
            :aria-label="theme.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="theme.toggle()"
          >
            <svg v-if="theme.isDark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
        </nav>
      </div>
    </header>

    <!-- Theme toggle on auth pages (no navbar) -->
    <button
      v-show="isAuthPage"
      type="button"
      class="theme-toggle theme-toggle--fixed"
      :aria-label="theme.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      @click="theme.toggle()"
    >
      <svg v-if="theme.isDark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    </button>

    <main>
      <RouterView v-slot="{ Component }">
        <Transition name="route" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>
