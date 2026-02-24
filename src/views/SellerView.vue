<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useAuthStore } from '@/stores/auth'
import type { Product } from '@/stores/products'

const productsStore = useProductsStore()
const authStore = useAuthStore()

const formOpen = ref<'none' | 'create' | 'edit'>('none')
const editingId = ref<string | null>(null)
const formSaving = ref(false)
const formError = ref<string | null>(null)

const form = ref({
  name: '',
  category: '',
  stock: 0,
  price: 0,
  discount: 0,
})

function formatPrice(n: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(n)
}

function formatPriceInput(num: number): string {
  if (num === 0) return ''
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

function parsePriceInput(str: string): number {
  const digits = str.replace(/\D/g, '')
  return digits === '' ? 0 : parseInt(digits, 10)
}

const priceDisplay = computed({
  get: () => formatPriceInput(form.value.price),
  set: (v: string) => {
    form.value.price = parsePriceInput(v)
  },
})

function openCreate() {
  editingId.value = null
  formError.value = null
  form.value = {
    name: '',
    category: productsStore.categories[0] ?? '',
    stock: 0,
    price: 0,
    discount: 0,
  }
  formOpen.value = 'create'
}

function openEdit(p: Product) {
  editingId.value = p.id
  formError.value = null
  form.value = {
    name: p.name,
    category: p.category,
    stock: p.stock,
    price: p.price,
    discount: p.discount,
  }
  formOpen.value = 'edit'
}

function closeForm() {
  formOpen.value = 'none'
  editingId.value = null
}

const formValid = computed(() => {
  const f = form.value
  return (
    f.name.trim() !== '' &&
    f.category.trim() !== '' &&
    f.stock >= 0 &&
    f.price >= 0 &&
    f.discount >= 0 &&
    f.discount <= 100
  )
})

async function saveProduct() {
  if (!formValid.value || formSaving.value) return
  const f = form.value
  formError.value = null
  formSaving.value = true
  try {
    const payload = {
      name: f.name.trim(),
      category: f.category.trim(),
      stock: Math.max(0, Math.floor(f.stock)),
      price: Math.max(0, Math.floor(f.price)),
      discount: Math.max(0, Math.min(100, Math.floor(f.discount))),
    }
    if (formOpen.value === 'create') {
      const userId = authStore.currentUser?.id
      if (!userId) {
        formError.value = 'You must be logged in to add a product.'
        return
      }
      await productsStore.addProduct(payload, userId)
    } else if (editingId.value) {
      await productsStore.updateProduct(editingId.value, payload)
    }
    closeForm()
  } catch (e) {
    formError.value = e instanceof Error ? e.message : 'Failed to save product'
  } finally {
    formSaving.value = false
  }
}

async function confirmDelete(p: Product) {
  const ok = window.confirm(`Delete product "${p.name}"? This action cannot be undone.`)
  if (!ok) return
  try {
    await productsStore.deleteProduct(p.id)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to delete product'
    productsStore.clearError()
    alert(msg)
  }
}

onMounted(() => {
  productsStore.clearError()
  productsStore.fetchProducts()
})

const sortedProducts = computed(() => {
  return [...productsStore.products].sort((a, b) => {
    const na = a.name.toLowerCase()
    const nb = b.name.toLowerCase()
    return na.localeCompare(nb)
  })
})
</script>

<template>
  <div class="seller mx-auto max-w-6xl px-4 py-8">
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div class="">
        <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-200 pb-5">
          Seller Center
        </h1>
      </div>
      <button
        v-if="formOpen === 'none'"
        type="button"
        class="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-primary-hover dark:bg-primary dark:hover:bg-primary-hover"
        @click="openCreate"
      >
        + Add Product
      </button>
    </div>

    <!-- Add / Edit form -->
    <section
      v-if="formOpen !== 'none'"
      class="seller-form mb-8 rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-600 dark:bg-slate-800/50"
    >
      <h2 class="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-200">
        {{ formOpen === 'create' ? 'Add New Product' : 'Edit Product' }}
      </h2>
      <form
        class="grid gap-4 sm:grid-cols-2"
        @submit.prevent="saveProduct"
      >
        <div class="sm:col-span-2">
          <label for="seller-name" class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Product Name
          </label>
          <input
            id="seller-name"
            v-model="form.name"
            type="text"
            required
            class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
            placeholder="Example: Wireless Earbuds"
          />
        </div>
        <div>
          <label for="seller-category" class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Category
          </label>
          <input
            id="seller-category"
            v-model="form.category"
            type="text"
            list="seller-category-list"
            required
            class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
            placeholder="e.g. Electronics"
          />
          <datalist id="seller-category-list">
            <option v-for="cat in productsStore.categories" :key="cat" :value="cat" />
          </datalist>
        </div>
        <div>
          <label for="seller-stock" class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Stock
          </label>
          <input
            id="seller-stock"
            v-model.number="form.stock"
            type="number"
            min="0"
            step="1"
            class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
          />
        </div>
        <div>
          <label for="seller-price" class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Price (IDR)
          </label>
          <input
            id="seller-price"
            v-model="priceDisplay"
            type="text"
            inputmode="numeric"
            autocomplete="off"
            placeholder="0"
            class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
          />
        </div>
        <div>
          <label for="seller-discount" class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Discount (%)
          </label>
          <input
            id="seller-discount"
            v-model.number="form.discount"
            type="number"
            min="0"
            max="100"
            step="1"
            class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
          />
        </div>
        <p v-if="formError" class="sm:col-span-2 text-sm text-red-600 dark:text-red-400">
          {{ formError }}
        </p>
        <div class="flex flex-wrap gap-2 sm:col-span-2">
          <button
            type="submit"
            class="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-primary-hover disabled:opacity-50 dark:bg-primary dark:hover:bg-primary-hover"
            :disabled="!formValid || formSaving"
          >
            {{ formSaving ? 'Saving...' : (formOpen === 'create' ? 'Save' : 'Update') }}
          </button>
          <button
            type="button"
            class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            @click="closeForm"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>

    <!-- Fetch error -->
    <p
      v-if="productsStore.error"
      class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
    >
      {{ productsStore.error }}
    </p>

    <!-- Products table -->
    <section class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow dark:border-slate-600 dark:bg-slate-800">
      <div v-if="productsStore.loading" class="py-12 text-center text-slate-500 dark:text-slate-400">
        Loading products...
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[640px] text-left text-sm">
          <thead class="border-b border-slate-200 bg-slate-50 dark:border-slate-600 dark:bg-slate-700/50">
            <tr>
              <th class="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">Name</th>
              <th class="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">Category</th>
              <th class="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">Price</th>
              <th class="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">Stock</th>
              <th class="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">Discount</th>
              <th class="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 dark:divide-slate-600">
            <tr
              v-for="p in sortedProducts"
              :key="p.id"
              class="text-slate-700 dark:text-slate-300"
            >
              <td class="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">
                {{ p.name }}
              </td>
              <td class="px-4 py-3">{{ p.category }}</td>
              <td class="px-4 py-3">{{ formatPrice(p.price) }}</td>
              <td class="px-4 py-3">{{ p.stock }}</td>
              <td class="px-4 py-3">{{ p.discount }}%</td>
              <td class="px-4 py-3 text-right">
                <button
                  type="button"
                  class="inline-flex rounded p-1.5 text-primary transition hover:bg-primary/10 dark:hover:bg-primary/20"
                  aria-label="Edit"
                  title="Edit"
                  @click="openEdit(p)"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  type="button"
                  class="inline-flex rounded p-1.5 text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                  aria-label="Delete"
                  title="Delete"
                  @click="confirmDelete(p)"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p
        v-if="!productsStore.loading && productsStore.products.length === 0"
        class="py-12 text-center text-slate-500 dark:text-slate-400"
      >
        No products yet. Click "Add Product" to add one.
      </p>
    </section>
  </div>
</template>
