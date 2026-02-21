import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
  ],
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  const isGuestRoute = to.meta.guest === true
  const requiresAuth = to.meta.requiresAuth === true

  if (requiresAuth && !auth.isAuthenticated) {
    next({ name: 'login' })
    return
  }

  if (isGuestRoute && auth.isAuthenticated) {
    next({ name: 'home' })
    return
  }

  next()
})

export default router
