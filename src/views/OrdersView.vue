<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { listCheckouts, type CheckoutListItem } from '@/services/checkouts'

const checkouts = ref<CheckoutListItem[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

function formatPrice(n: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(n)
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso)
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(d)
  } catch {
    return iso
  }
}

async function fetchOrders() {
  loading.value = true
  error.value = null
  try {
    checkouts.value = await listCheckouts()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load orders'
    checkouts.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchOrders)
</script>

<template>
  <div class="mx-auto min-h-[calc(100vh-4rem)] max-w-3xl px-4 py-8">
    <h1 class="mb-6 text-2xl font-bold text-slate-800 dark:text-slate-100">
      Order History
    </h1>

    <p
      v-if="error"
      class="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
    >
      {{ error }}
    </p>

    <div
      v-if="loading"
      class="py-12 text-center text-slate-500 dark:text-slate-400"
    >
      Loading orders...
    </div>

    <div
      v-else-if="checkouts.length === 0"
      class="rounded-xl border border-slate-200 bg-slate-50 py-12 text-center dark:border-slate-600 dark:bg-slate-700/50"
    >
      <p class="text-slate-500 dark:text-slate-400">
        You have no orders yet. Add products to cart and checkout from the home page.
      </p>
      <RouterLink
        :to="{ name: 'home' }"
        class="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover"
      >
        Go to Home
      </RouterLink>
    </div>

    <ul v-else class="space-y-4">
      <li
        v-for="order in checkouts"
        :key="order.id"
        class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-600 dark:bg-slate-800/80"
      >
        <h3 class="font-semibold text-slate-800 dark:text-slate-200">
          {{ order.product_name }}
        </h3>
        <dl class="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div class="flex justify-between sm:block">
            <dt class="text-slate-500 dark:text-slate-400">
              Quantity
            </dt>
            <dd class="font-medium text-slate-800 dark:text-slate-200">
              {{ order.quantity }}
            </dd>
          </div>
          <div class="flex justify-between sm:block">
            <dt class="text-slate-500 dark:text-slate-400">
              Purchased at
            </dt>
            <dd class="font-medium text-slate-800 dark:text-slate-200">
              {{ formatDate(order.created_at) }}
            </dd>
          </div>
          <template v-if="order.discount > 0">
            <div class="flex justify-between sm:block">
              <dt class="text-slate-500 dark:text-slate-400">
                Original price
              </dt>
              <dd class="text-slate-500 line-through dark:text-slate-400">
                {{ formatPrice(order.price * order.quantity) }}
              </dd>
            </div>
            <div class="flex justify-between sm:block">
              <dt class="text-slate-500 dark:text-slate-400">
                Discount
              </dt>
              <dd class="font-medium text-sale">
                -{{ order.discount }}%
              </dd>
            </div>
          </template>
          <div class="flex justify-between sm:block sm:col-span-2">
            <dt class="text-slate-500 dark:text-slate-400">
              Amount paid
            </dt>
            <dd class="font-semibold text-slate-800 dark:text-slate-200">
              {{ formatPrice(order.total_price) }}
            </dd>
          </div>
        </dl>
      </li>
    </ul>
  </div>
</template>
