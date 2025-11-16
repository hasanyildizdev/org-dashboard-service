export default defineNuxtRouteMiddleware(() => {
  const { isAuthenticated } = useAuth()

  // If authenticated and trying to access guest route (login, register)
  if (isAuthenticated.value) {
    return navigateTo('/dashboard')
  }
})
