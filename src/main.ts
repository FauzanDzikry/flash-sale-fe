import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { createAppRouter } from './router'

const savedTheme = localStorage.getItem('flash-sale-theme')
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(createAppRouter(pinia))
app.mount('#app')
