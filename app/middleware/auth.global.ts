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
  
  // Sync cookie token to localStorage for Apollo
  if (token.value && typeof window !== 'undefined') {
    const storedToken = localStorage.getItem('token')
    if (storedToken !== token.value) {
      localStorage.setItem('token', token.value)
      console.log('🔄 Token synced in middleware')
    }
  }
  
  if(!authStore.user){
    console.log('Fetching user in middleware...')
    await authStore.fetchUser()
  }
  
  // If not authenticated after initialization, redirect to login
  if (!authStore.isAuthenticated) {
    console.log('❌ Not authenticated after init - redirecting to login')
    return navigateTo('/auth/login')
  }

  // Check if email is verified
  if (!authStore.isEmailVerified) {
    console.log('⚠️ Email not verified, redirecting to verification page')
    // Don't redirect if already on verification pages
    if (to.path === '/auth/verify-email' || to.path === '/auth/email-verified') {
      return
    }
    return navigateTo('/auth/verify-email')
  }
})
