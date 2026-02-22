import { ref } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'flash-sale-theme'

export type Theme = 'light' | 'dark'

function getStored(): Theme {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'dark' || v === 'light') return v
  } catch {}
  return 'light'
}

function apply(isDark: boolean) {
  if (typeof document === 'undefined') return
  if (isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(getStored() === 'dark')
  apply(isDark.value)

  function toggle() {
    isDark.value = !isDark.value
    localStorage.setItem(STORAGE_KEY, isDark.value ? 'dark' : 'light')
    apply(isDark.value)
  }

  function setTheme(theme: Theme) {
    isDark.value = theme === 'dark'
    localStorage.setItem(STORAGE_KEY, theme)
    apply(isDark.value)
  }

  return { isDark, toggle, setTheme }
})
