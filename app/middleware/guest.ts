import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  // If authenticated and trying to access guest route (login, register)
  if (authStore.isAuthenticated) {
    // If email is not verified, redirect to verification page
    if (!authStore.isEmailVerified) {
      return navigateTo('/auth/verify-email')
    }
    
    // If authenticated and verified, redirect to dashboard
    return navigateTo('/')
  }
})
