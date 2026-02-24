<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { useProductFiltersStore } from '@/stores/productFilters'
import { useCartStore } from '@/stores/cart'
import Modal from '@/components/Modal.vue'
import logo from '@/assets/logo.png'
import logoWhite from '@/assets/logo-white.png'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const theme = useThemeStore()
const productFilters = useProductFiltersStore()
const cart = useCartStore()
const logoSrc = computed(() => (theme.isDark ? logoWhite : logo))

function handleLogout() {
  auth.logout()
  router.push({ name: 'login' })
}

function onSessionExpiredOk() {
  auth.ackSessionExpired()
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
          class="app-header__brand flex shrink-0 items-center transition opacity-90 hover:opacity-100"
          aria-label="Flash Sale"
        >
          <img
            :src="logoSrc"
            alt="Flash Sale"
            class="app-header__logo h-8 w-auto object-contain sm:h-9"
          />
        </RouterLink>
        <div
          v-if="auth.isAuthenticated"
          class="flex min-w-0 flex-1 flex-wrap items-center gap-2 px-4 sm:gap-3"
        >
          <label for="navbar-product-search" class="sr-only">Search products</label>
          <input
            id="navbar-product-search"
            v-model="productFilters.searchQuery"
            type="search"
            placeholder="Search products..."
            class="w-full min-w-0 max-w-[180px] rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder-slate-500 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400 sm:max-w-[220px]"
            autocomplete="off"
          />
          <select
            v-model="productFilters.selectedCategory"
            class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
            aria-label="Filter by category"
          >
            <option value="">All categories</option>
            <option v-for="cat in productFilters.categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>
        <nav class="ml-auto flex min-w-0 flex-1 flex-wrap items-center justify-end gap-2 sm:gap-4">
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
              to="/seller"
              class="rounded-lg px-3 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-slate-200"
              active-class="router-link-active bg-slate-100 font-medium text-slate-900 dark:bg-slate-700 dark:text-slate-200"
            >
              Seller Center
            </RouterLink>
            <RouterLink
              to="/cart"
              class="relative rounded-lg px-3 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-slate-200"
              aria-label="Cart"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span
                v-if="cart.totalItems > 0"
                class="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-white"
              >
                {{ cart.totalItems > 99 ? '99+' : cart.totalItems }}
              </span>
            </RouterLink>
            <button
              type="button"
              class="app-header__btn-logout rounded-lg px-3 py-2 text-slate-600 transition hover:bg-red-50 hover:text-red-600"
              @click="handleLogout"
            >
              Log out
            </button>
            <button
              type="button"
              class="theme-toggle shrink-0"
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
          </template>
          <button
            v-if="!auth.isAuthenticated"
            type="button"
            class="theme-toggle shrink-0"
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

    <!-- Popup when JWT expired (401): notice before redirect to login -->
    <Modal
      :show="auth.sessionExpiredShow"
      title="Session expired"
      :close-on-overlay="false"
      @close="onSessionExpiredOk"
    >
      <div class="text-center py-2">
        <div class="mb-4">
          <svg class="h-12 w-12 text-amber-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Session Expired</h2>
        <p class="text-slate-600 dark:text-slate-400 text-[15px] mb-5">
          Your session has expired. Please login again to continue.
        </p>
        <button
          type="button"
          class="inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-primary-hover"
          @click="onSessionExpiredOk"
        >
          Login
        </button>
      </div>
    </Modal>
  </div>
</template>

