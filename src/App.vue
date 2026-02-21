<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const auth = useAuthStore()

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
      class="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur transition-all duration-300"
    >
      <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:py-4">
        <RouterLink
          :to="auth.isAuthenticated ? '/' : '/login'"
          class="text-base font-bold text-slate-800 transition hover:text-primary sm:text-lg"
        >
          Flash Sale
        </RouterLink>
        <nav class="flex flex-wrap items-center gap-2 sm:gap-4">
          <template v-if="!auth.isAuthenticated">
            <RouterLink
              to="/login"
              class="rounded-lg px-3 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              active-class="bg-slate-100 font-medium text-slate-900"
            >
              Login
            </RouterLink>
            <RouterLink
              to="/register"
              class="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-primary-hover hover:shadow-lg"
              active-class="ring-2 ring-primary ring-offset-2"
            >
              Register
            </RouterLink>
          </template>
          <template v-else>
            <RouterLink
              to="/"
              class="rounded-lg px-3 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              active-class="bg-slate-100 font-medium text-slate-900"
            >
              Home
            </RouterLink>
            <RouterLink
              to="/about"
              class="rounded-lg px-3 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              active-class="bg-slate-100 font-medium text-slate-900"
            >
              About
            </RouterLink>
            <span class="px-3 py-2 text-slate-600">{{ auth.currentUser?.name }}</span>
            <button
              type="button"
              class="rounded-lg px-3 py-2 text-slate-600 transition hover:bg-red-50 hover:text-red-600"
              @click="auth.logout()"
            >
              Log out
            </button>
          </template>
        </nav>
      </div>
    </header>

    <main>
      <RouterView v-slot="{ Component }">
        <Transition name="route" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>
