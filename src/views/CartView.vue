<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useProductsStore } from '@/stores/products'
import { checkout } from '@/services/checkouts'

const router = useRouter()
const cart = useCartStore()
const productsStore = useProductsStore()

const checkoutLoading = ref(false)
const successMessage = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

function priceAfterDiscount(price: number, discount: number): number {
  return Math.round(price * (1 - discount / 100))
}

function formatPrice(n: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(n)
}

function setQty(productId: string, delta: number) {
  const item = cart.items.find((i) => i.productId === productId)
  if (!item) return
  cart.setQty(productId, item.qty + delta)
}

function formatError(msg: string): string {
  if (msg.toLowerCase().includes('insufficient stock')) {
    return 'Stock insufficient. Reduce quantity or try another product.'
  }
  if (msg.toLowerCase().includes('not found') || msg.toLowerCase().includes('product not found')) {
    return 'Product not found.'
  }
  if (msg.toLowerCase().includes('session expired') || msg.toLowerCase().includes('unauthorized')) {
    return 'Session expired. Please sign in again.'
  }
  if (msg.toLowerCase().includes('enqueue') || msg.toLowerCase().includes('failed')) {
    return 'Checkout processing failed. Please try again.'
  }
  return msg || 'Checkout failed.'
}

async function handleCheckout() {
  if (cart.items.length === 0) return

  checkoutLoading.value = true
  successMessage.value = null
  errorMessage.value = null

  const results = await Promise.allSettled(
    cart.items.map((item) => checkout(item.productId, item.qty))
  )

  const succeeded: string[] = []
  const failed: string[] = []

  results.forEach((result, i) => {
    const item = cart.items[i]
    if (!item) return
    if (result.status === 'fulfilled') {
      succeeded.push(item.productId)
    } else {
      failed.push(item.name)
    }
  })

  succeeded.forEach((productId) => cart.removeItem(productId))

  if (failed.length === 0) {
    successMessage.value = 'Order submitted. Processing your order...'
    productsStore.fetchAllProducts()
    setTimeout(() => router.push({ name: 'home' }), 1500)
  } else if (succeeded.length > 0) {
    const lastError = results[results.findIndex((r) => r.status === 'rejected')] as PromiseRejectedResult
    errorMessage.value = `${succeeded.length} order(s) submitted. ${failed.length} failed: ${formatError(lastError.reason?.message ?? 'Unknown error')}`
  } else {
    const firstRejection = results.find((r) => r.status === 'rejected') as PromiseRejectedResult
    errorMessage.value = formatError(firstRejection.reason?.message ?? 'Unknown error')
  }

  checkoutLoading.value = false
}
</script>

<template>
  <div class="mx-auto min-h-[calc(100vh-4rem)] max-w-3xl px-4 py-8">
    <h1 class="mb-6 text-2xl font-bold text-slate-800 dark:text-slate-100">
      Cart
    </h1>

    <div
      v-if="cart.items.length === 0"
      class="rounded-xl border border-slate-200 bg-slate-50 py-12 text-center dark:border-slate-600 dark:bg-slate-700/50"
    >
      <p class="text-slate-500 dark:text-slate-400">
        Your cart is empty. Add products from the home page.
      </p>
      <router-link
        :to="{ name: 'home' }"
        class="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover"
      >
        Go to Home
      </router-link>
    </div>

    <template v-else>
      <ul class="space-y-4">
        <li
          v-for="item in cart.items"
          :key="item.productId"
          class="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-600 dark:bg-slate-800/80"
        >
          <div class="min-w-0 flex-1">
            <h3 class="font-semibold text-slate-800 dark:text-slate-200">
              {{ item.name }}
            </h3>
            <p class="mt-1 text-sm">
              <span v-if="item.discount > 0" class="text-slate-500 line-through dark:text-slate-400">
                {{ formatPrice(item.price) }}
              </span>
              <span :class="item.discount > 0 ? 'font-semibold text-sale' : 'text-slate-800 dark:text-slate-200'">
                {{ formatPrice(priceAfterDiscount(item.price, item.discount)) }}
              </span>
            </p>
          </div>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
              :disabled="item.qty <= 1"
              aria-label="Decrease quantity"
              @click="setQty(item.productId, -1)"
            >
              −
            </button>
            <span
              class="min-w-[2rem] text-center font-medium text-slate-800 dark:text-slate-200"
              aria-label="Quantity"
            >
              {{ item.qty }}
            </span>
            <button
              type="button"
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
              :disabled="item.qty >= item.maxQty"
              aria-label="Increase quantity"
              @click="setQty(item.productId, 1)"
            >
              +
            </button>
            <button
              type="button"
              class="ml-2 rounded-lg px-2 py-1.5 text-sm text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
              aria-label="Remove from cart"
              @click="cart.removeItem(item.productId)"
            >
              Remove
            </button>
          </div>
        </li>
      </ul>

      <div
        v-if="successMessage"
        class="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
      >
        {{ successMessage }}
      </div>
      <div
        v-if="errorMessage"
        class="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
      >
        {{ errorMessage }}
      </div>
      <div
        class="mt-8 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-600 dark:bg-slate-800/80"
      >
        <div class="flex justify-between text-lg font-semibold text-slate-800 dark:text-slate-200">
          <span>Total</span>
          <span>{{ formatPrice(cart.totalPrice) }}</span>
        </div>
        <button
          type="button"
          class="w-full rounded-lg bg-primary py-3 text-base font-semibold text-white shadow-md transition hover:bg-primary-hover hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="checkoutLoading"
          @click="handleCheckout"
        >
          <span v-if="checkoutLoading">Processing...</span>
          <span v-else>Checkout</span>
        </button>
      </div>
    </template>
  </div>
</template>
