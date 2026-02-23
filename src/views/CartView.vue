<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const cart = useCartStore()

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

function handleCheckout() {
  if (cart.items.length === 0) return
  cart.clearCart()
  router.push({ name: 'home' })
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
            <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {{ formatPrice(priceAfterDiscount(item.price, item.discount)) }}
              <span v-if="item.discount > 0" class="text-slate-500 line-through">
                {{ formatPrice(item.price) }}
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
        class="mt-8 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-600 dark:bg-slate-800/80"
      >
        <div class="flex justify-between text-lg font-semibold text-slate-800 dark:text-slate-200">
          <span>Total</span>
          <span>{{ formatPrice(cart.totalPrice) }}</span>
        </div>
        <button
          type="button"
          class="w-full rounded-lg bg-primary py-3 text-base font-semibold text-white shadow-md transition hover:bg-primary-hover hover:shadow-lg"
          @click="handleCheckout"
        >
          Checkout
        </button>
      </div>
    </template>
  </div>
</template>
