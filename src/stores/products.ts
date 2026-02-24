import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  productsApi,
  type ProductResponse,
  type CreateProductPayload,
  type UpdateProductPayload,
} from '@/services/products'

/** Product in frontend (aligned with API: stock). */
export interface Product {
  id: string
  name: string
  category: string
  stock: number
  price: number
  discount: number
  created_by?: string
}

function mapResponse(p: ProductResponse | null | undefined): Product | null {
  if (p == null || typeof p !== 'object') return null
  const id = p.id != null ? String(p.id) : ''
  if (!id) return null
  return {
    id,
    name: typeof p.name === 'string' ? p.name : '',
    category: typeof p.category === 'string' ? p.category : '',
    stock: Number(p.stock) || 0,
    price: Number(p.price) || 0,
    discount: Number(p.discount) || 0,
    created_by: p.created_by != null ? String(p.created_by) : undefined,
  }
}

export const useProductsStore = defineStore('products', () => {
  /** User's products (Seller Center) — from GET /products (GetAllByUser). */
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  /** All products (Home/marketplace) — from GET /products/all (GetAll). */
  const allProducts = ref<Product[]>([])
  const allProductsLoading = ref(false)
  const allProductsError = ref<string | null>(null)

  /** Categories from user's products (for Seller form). */
  const categories = computed(() => {
    const set = new Set(products.value.map((p) => p.category).filter(Boolean))
    return Array.from(set).sort()
  })

  /** Categories from all products (for Home filter). */
  const allCategories = computed(() => {
    const set = new Set(allProducts.value.map((p) => p.category).filter(Boolean))
    return Array.from(set).sort()
  })

  /** Fetch user's product list — GET /products (GetAllByUser, soft-delete excluded). */
  async function fetchProducts(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const list = await productsApi.list()
      const raw = Array.isArray(list) ? list : []
      products.value = raw.map(mapResponse).filter((p): p is Product => p != null)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load products'
      products.value = []
    } finally {
      loading.value = false
    }
  }

  /** Fetch all products — GET /products/all (GetAll, soft-delete excluded). */
  async function fetchAllProducts(): Promise<void> {
    allProductsLoading.value = true
    allProductsError.value = null
    try {
      const list = await productsApi.getAll()
      const raw = Array.isArray(list) ? list : []
      allProducts.value = raw.map(mapResponse).filter((p): p is Product => p != null)
    } catch (e) {
      allProductsError.value = e instanceof Error ? e.message : 'Failed to load products'
      allProducts.value = []
    } finally {
      allProductsLoading.value = false
    }
  }

  /** Create product via API. created_by wajib dari user login. */
  async function addProduct(
    data: Omit<CreateProductPayload, 'created_by'>,
    createdBy: string
  ): Promise<Product> {
    const payload: CreateProductPayload = { ...data, created_by: createdBy }
    const created = await productsApi.create(payload)
    const product = mapResponse(created)
    if (!product) throw new Error('Invalid product response')
    products.value = [...products.value, product]
    return product
  }

  /** Update product via API. */
  async function updateProduct(
    id: string,
    data: Partial<UpdateProductPayload>
  ): Promise<Product | null> {
    const current = products.value.find((p) => p.id === id)
    if (!current) return null
    const payload: UpdateProductPayload = {
      name: data.name ?? current.name,
      category: data.category ?? current.category,
      stock: data.stock ?? current.stock,
      price: data.price ?? current.price,
      discount: data.discount ?? current.discount,
    }
    const updated = await productsApi.update(id, payload)
    const product = mapResponse(updated)
    if (!product) return null
    const index = products.value.findIndex((p) => p.id === id)
    if (index !== -1) {
      products.value = [
        ...products.value.slice(0, index),
        product,
        ...products.value.slice(index + 1),
      ]
    }
    return product
  }

  /** Delete product via API. */
  async function deleteProduct(id: string): Promise<boolean> {
    await productsApi.delete(id)
    const index = products.value.findIndex((p) => p.id === id)
    if (index === -1) return false
    products.value = products.value.filter((p) => p.id !== id)
    return true
  }

  function getProduct(id: string): Product | undefined {
    return products.value.find((p) => p.id === id)
  }

  /** Find product from all-products list (for cart/detail). */
  function getAllProduct(id: string): Product | undefined {
    return allProducts.value.find((p) => p.id === id)
  }

  function clearError() {
    error.value = null
  }

  function clearAllProductsError() {
    allProductsError.value = null
  }

  return {
    products,
    loading,
    error,
    categories,
    allProducts,
    allProductsLoading,
    allProductsError,
    allCategories,
    fetchProducts,
    fetchAllProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    getAllProduct,
    clearError,
    clearAllProductsError,
  }
})
