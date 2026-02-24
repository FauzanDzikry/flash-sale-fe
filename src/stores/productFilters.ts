import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useProductsStore } from '@/stores/products'

export const useProductFiltersStore = defineStore('productFilters', () => {
  const searchQuery = ref('')
  const selectedCategory = ref('')
  const productsStore = useProductsStore()

  /** Categories for Home filter (from GET /products/all). */
  const categories = computed(() => productsStore.allCategories)

  return {
    searchQuery,
    selectedCategory,
    categories,
  }
})
