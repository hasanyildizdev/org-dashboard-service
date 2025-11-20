/**
 * Middleware to ensure user has verified their email
 * Redirects to verify-email page if not verified
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()

  // Wait for auth to be initialized
  if (!authStore.initialized) {
    await authStore.fetchUser()
  }

  // If user is not authenticated, let auth middleware handle it
  if (!authStore.isAuthenticated) {
    return
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
