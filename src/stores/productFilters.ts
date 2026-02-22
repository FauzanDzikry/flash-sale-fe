import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { dummyProducts } from '@/data/dummyProducts'

export const useProductFiltersStore = defineStore('productFilters', () => {
  const searchQuery = ref('')
  const selectedCategory = ref('')

  const regularProducts = computed(() =>
    dummyProducts.filter((p) => p.discount <= 50)
  )

  const categories = computed(() => {
    const set = new Set(regularProducts.value.map((p) => p.category))
    return Array.from(set).sort()
  })

  return {
    searchQuery,
    selectedCategory,
    categories,
  }
})
