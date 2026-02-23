<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProductFiltersStore } from '@/stores/productFilters'
import { useCartStore } from '@/stores/cart'
import { dummyProducts } from '@/data/dummyProducts'
import type { DummyProduct } from '@/data/dummyProducts'

const router = useRouter()
const auth = useAuthStore()
const productFilters = useProductFiltersStore()
const cart = useCartStore()

function addToCartAndGo(product: DummyProduct) {
  cart.addToCart(product, 1)
  router.push({ name: 'cart' })
}
const now = ref(Date.now())
const flashSaleEndsAt = ref<number>(0)

const displayName = computed(() => {
  const user = auth.currentUser
  const name = (user?.name ?? '').trim()
  if (name) return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
  const email = (user?.email ?? '').trim()
  if (email) {
    const beforeAt = email.split('@')[0] || email
    return beforeAt.charAt(0).toUpperCase() + beforeAt.slice(1).toLowerCase()
  }
  return 'User'
})

const flashSaleProducts = computed(() =>
  dummyProducts.filter((p) => p.discount > 50)
)

const filteredFlashSaleProducts = computed(() => {
  const q = productFilters.searchQuery.trim().toLowerCase()
  const cat = productFilters.selectedCategory
  return flashSaleProducts.value.filter((p) => {
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
    const matchCategory = !cat || p.category === cat
    return matchSearch && matchCategory
  })
})

const flashSaleTimeLeft = computed(() => {
  const diff = Math.max(0, flashSaleEndsAt.value - now.value)
  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    expired: diff === 0,
  }
})

const flashSaleSectionExpired = computed(() => flashSaleTimeLeft.value.expired)

function formatSectionCountdown(): string {
  const t = flashSaleTimeLeft.value
  if (t.expired) return 'Ended'
  return `${String(t.hours).padStart(2, '0')} : ${String(t.minutes).padStart(2, '0')} : ${String(t.seconds).padStart(2, '0')}`
}

const regularProducts = computed(() =>
  dummyProducts.filter((p) => p.discount <= 50)
)

const filteredRegularProducts = computed(() => {
  const q = productFilters.searchQuery.trim().toLowerCase()
  const cat = productFilters.selectedCategory
  return regularProducts.value.filter((p) => {
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
    const matchCategory = !cat || p.category === cat
    return matchSearch && matchCategory
  })
})

function formatPrice(n: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(n)
}

function priceAfterDiscount(price: number, discount: number): number {
  return Math.round(price * (1 - discount / 100))
}

const LOW_STOCK_THRESHOLD = 10
function isLowStock(qty: number): boolean {
  return qty <= LOW_STOCK_THRESHOLD
}

let timer: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  flashSaleEndsAt.value = Date.now() + 15 * 60 * 1000
  timer = setInterval(() => {
    now.value = Date.now()
  }, 1000)
})
onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="min-h-[calc(100vh-4rem)]">
    <section class="mx-auto w-full px-4 py-8 sm:py-5">
      <h1 class="home-card__title pb-4 text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 sm:text-4xl">
        Welcome, {{ displayName }}
      </h1>

      <!-- Flash Sale section (no search, hidden after countdown) -->
      <div
        v-if="!flashSaleSectionExpired"
        class="flash-sale-section w-full overflow-hidden rounded-2xl border-2 border-primary-border bg-gradient-to-br from-primary-light to-sky-100 p-6 dark:border-primary/50 dark:from-primary/20 dark:to-slate-800/80 sm:p-8"
      >
        <div class="flex flex-wrap items-center justify-between gap-4 py-2">
          <h2 class="text-xl font-bold uppercase tracking-wide text-slate-800 dark:text-slate-100 sm:text-2xl">
            Flash Sale
          </h2>
          <div class="inline-flex items-center gap-3 rounded-lg bg-red-500 px-4 py-1.5 shadow dark:bg-red-600">
            <span class="text-xs font-medium text-white">Ends in</span>
            <span class="font-mono text-sm font-bold tabular-nums text-white">
              {{ formatSectionCountdown() }}
            </span>
          </div>
        </div>
        <div
          class="flash-sale-carousel flex gap-4 overflow-x-auto pb-2 scroll-smooth"
          style="scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;"
        >
          <div
            v-for="product in filteredFlashSaleProducts"
            :key="product.id"
            class="flash-sale-card relative flex min-w-[280px] max-w-[280px] shrink-0 flex-col overflow-hidden rounded-xl border border-primary-border bg-white p-4 shadow-md dark:border-primary/40 dark:bg-slate-800/80"
            style="scroll-snap-align: start;"
          >
            <span class="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-white shadow">
              Flash Sale
            </span>
            <div class="mb-2 mt-1">
              <span class="inline-block rounded bg-red-500 px-2 py-0.5 text-sm font-semibold text-white">
                -{{ product.discount }}%
              </span>
            </div>
            <h3 class="mb-2 font-semibold text-slate-800 dark:text-slate-200">
              {{ product.name }}
            </h3>
            <div class="mb-2 flex items-center gap-2">
              <p class="text-sm text-slate-600 dark:text-slate-400">
                Stock: {{ product.qty }}
              </p>
              <span
                v-if="isLowStock(product.qty)"
                class="rounded bg-amber-200 px-1.5 py-0.5 text-xs font-medium text-amber-900 dark:bg-amber-700 dark:text-amber-100"
              >
                Almost sold out
              </span>
            </div>
            <p class="mb-1 text-sm text-slate-500 line-through dark:text-slate-500">
              {{ formatPrice(product.price) }}
            </p>
            <p class="mb-4 text-lg font-bold text-red-600 dark:text-red-400">
              {{ formatPrice(priceAfterDiscount(product.price, product.discount)) }}
            </p>
            <div class="mt-auto flex justify-end">
              <button
                type="button"
                class="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white shadow transition hover:bg-primary-hover disabled:opacity-50"
                :disabled="product.qty < 1"
                aria-label="Add to cart"
                @click="addToCartAndGo(product)"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Products section -->
      <div class="home-card mt-8 w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800 sm:p-8">
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div
            v-for="product in filteredRegularProducts"
            :key="product.id"
            class="flex flex-col rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-600 dark:bg-slate-700/50"
          >
            <h3 class="mb-2 font-semibold text-slate-800 dark:text-slate-200">
              {{ product.name }}
            </h3>
            <p class="mb-1 text-sm text-slate-600 dark:text-slate-400">
              Stock: {{ product.qty }}
            </p>
            <p class="mb-1 text-lg font-semibold text-slate-800 dark:text-slate-200">
              {{ formatPrice(product.price) }}
            </p>
            <p v-if="product.discount > 0" class="mb-4 text-sm text-slate-600 dark:text-slate-400">
              Discount {{ product.discount }}% →
              {{ formatPrice(priceAfterDiscount(product.price, product.discount)) }}
            </p>
            <p v-else class="mb-4"></p>
            <div class="mt-auto flex justify-end">
              <button
                type="button"
                class="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white shadow transition hover:bg-primary-hover disabled:opacity-50"
                :disabled="product.qty < 1"
                aria-label="Add to cart"
                @click="addToCartAndGo(product)"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <p
          v-if="filteredRegularProducts.length === 0"
          class="py-8 text-center text-slate-500 dark:text-slate-400"
        >
          No products match your search.
        </p>
      </div>
    </section>
  </div>
</template>
