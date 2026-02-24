import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import type { Product } from '@/stores/products'

const CART_STORAGE_KEY = 'flash-sale-cart'

export interface CartItem {
  productId: string
  name: string
  price: number
  discount: number
  maxQty: number
  qty: number
}

function priceAfterDiscount(price: number, discount: number): number {
  return Math.round(price * (1 - discount / 100))
}

function loadCartFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item: unknown): item is CartItem =>
        typeof item === 'object' &&
        item !== null &&
        'productId' in item &&
        'name' in item &&
        'price' in item &&
        'discount' in item &&
        'maxQty' in item &&
        'qty' in item
    )
  } catch {
    return []
  }
}

function saveCartToStorage(items: CartItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch {
    // ignore quota or other storage errors
  }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(loadCartFromStorage())

  watch(
    items,
    (val) => saveCartToStorage(val),
    { deep: true }
  )

  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.qty, 0)
  )

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => {
      const finalPrice = priceAfterDiscount(item.price, item.discount)
      return sum + finalPrice * item.qty
    }, 0)
  )

  function addToCart(product: Product, quantity = 1) {
    const existing = items.value.find((i) => i.productId === product.id)
    const addQty = Math.min(quantity, Math.max(0, product.stock - (existing?.qty ?? 0)))
    if (addQty <= 0) return

    if (existing) {
      existing.qty = Math.min(existing.qty + addQty, product.stock)
      existing.maxQty = product.stock
    } else {
      items.value.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        discount: product.discount,
        maxQty: product.stock,
        qty: addQty,
      })
    }
  }

  function setQty(productId: string, qty: number) {
    const item = items.value.find((i) => i.productId === productId)
    if (!item) return
    item.qty = Math.max(0, Math.min(qty, item.maxQty))
    if (item.qty === 0) {
      items.value = items.value.filter((i) => i.productId !== productId)
    }
  }

  function removeItem(productId: string) {
    items.value = items.value.filter((i) => i.productId !== productId)
  }

  function clearCart() {
    items.value = []
  }

  return {
    items,
    totalItems,
    totalPrice,
    addToCart,
    setQty,
    removeItem,
    clearCart,
  }
})
