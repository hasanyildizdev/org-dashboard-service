export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, fetchUser } = useAuth()

  // If not authenticated and trying to access protected route
  if (!isAuthenticated.value) {
    // Try to fetch user if token exists
    await fetchUser()
    
    // If still not authenticated, redirect to login
    if (!isAuthenticated.value) {
      return navigateTo('/auth/login')
    }
  }
})
