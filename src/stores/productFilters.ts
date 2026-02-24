import { ref } from 'vue'
import { defineStore } from 'pinia'

/** Category options (navbar + form): alphabetically sorted. */
export const CATEGORY_OPTIONS = ['books', 'electronics', 'fashion', 'sports'] as const

export const useProductFiltersStore = defineStore('productFilters', () => {
  const searchQuery = ref('')
  const selectedCategory = ref('')

  return {
    searchQuery,
    selectedCategory,
    categories: CATEGORY_OPTIONS,
  }
})
