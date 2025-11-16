import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  // If authenticated and trying to access guest route (login, register)
  if (authStore.isAuthenticated) {
    return navigateTo('/')
  }
})
