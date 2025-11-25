import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()
  const token = useCookie('auth_token')
  
  // Skip auth check for public auth pages
  const publicAuthPages = ['/auth/login', '/auth/register', '/auth/callback', '/auth/forgot-password']
  if (publicAuthPages.includes(to.path)) {
    return
  }

  // If no user in store but token exists, try to fetch user
  if (!authStore.user && token.value) {
    console.log('🔄 User not in store, fetching from API...')
    await authStore.fetchUser()
  }
  
  // If still no user or token, redirect to login
  if (!authStore.user || !token.value) {
    console.log('❌ No user or token - redirecting to login', {
      user: authStore.user,
      token: token.value ? 'exists' : 'missing'
    })
    return navigateTo('/auth/login')
  }
  
  // Check if email is verified
  if (!authStore.isEmailVerified && to.path !== '/auth/verify-email' && to.path !== '/auth/email-verified') {
    console.log('⚠️ Email not verified, redirecting to verification page')
    return navigateTo('/auth/verify-email')
  }
})
