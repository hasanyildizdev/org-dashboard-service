import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()
  
  // Skip auth check for public auth pages
  const publicAuthPages = ['/auth/login', '/auth/register', '/auth/callback', '/auth/forgot-password']
  if (publicAuthPages.includes(to.path)) {
    return
  }

  // If no user in store, try to fetch from server (will check httpOnly cookie)
  if (!authStore.user) {
    console.error('🔄 User not in store, fetching from API...')
    await authStore.fetchUser()
  }
  
  // If still no user, redirect to login
  if (!authStore.user) {
    console.error('❌ No user - redirecting to login')
    return navigateTo('/auth/login')
  }
  
  // Check if email is verified
  if (!authStore.isEmailVerified && to.path !== '/auth/verify-email' && to.path !== '/auth/email-verified') {
    console.error('⚠️ Email not verified, redirecting to verification page')
    return navigateTo('/auth/verify-email')
  }
})
