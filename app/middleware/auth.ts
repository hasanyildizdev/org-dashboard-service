import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run on client side
  if (import.meta.server) return
  
  const authStore = useAuthStore()
  const token = useCookie('auth_token')
  
  // If no token, redirect immediately
  if (!token.value) {
    console.log('❌ No token - redirecting to login')
    return navigateTo('/auth/login')
  }
  
  // Wait for auth initialization if not done yet
  if (!authStore.initialized) {
    console.log('⏳ Not initialized - fetching user...')
    await authStore.fetchUser()
  }
  
  // If not authenticated after initialization, redirect to login
  if (!authStore.isAuthenticated) {
    console.log('❌ Not authenticated after init - redirecting to login')
    return navigateTo('/auth/login')
  }
})
