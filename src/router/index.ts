import type { Pinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'
import { getToken } from '@/services/auth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('../views/CartView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/orders',
    name: 'orders',
    component: () => import('../views/OrdersView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/seller',
    name: 'seller',
    component: () => import('../views/SellerView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/auth/LoginView.vue'),
    meta: { guest: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/auth/RegisterView.vue'),
    meta: { guest: true },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('../views/auth/FeatureUnderMaintenanceView.vue'),
    meta: { guest: true },
  },
  {
    path: '/verify-otp',
    name: 'verify-otp',
    component: () => import('../views/auth/VerifyOtpView.vue'),
    meta: { guest: true },
  },
]

/** Dibuat dengan pinia agar guard pakai store yang sama; auth juga dicek via getToken() agar redirect ke home setelah login/register konsisten. */
export function createAppRouter(pinia: Pinia) {
  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
  })

  router.beforeEach((to) => {
    const auth = useAuthStore(pinia)
    const isGuestRoute = to.meta.guest === true
    const requiresAuth = to.meta.requiresAuth === true
    const isAuthenticated = auth.isAuthenticated || !!getToken()

    if (requiresAuth && !isAuthenticated) {
      return { name: 'login' }
    }

    if (isGuestRoute && isAuthenticated) {
      return { name: 'home' }
    }

    return true
  })

  return router
}
