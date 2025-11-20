import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin({
  name: 'auth-init',
  parallel: false,
  async setup(nuxtApp) {
    const authStore = useAuthStore()

    if (!import.meta.client) return  // Run client only
    
    // Wait for other plugins to load
    await nextTick()

    // Make sure $graphql is available
    if (!nuxtApp.$graphql) {
      console.error('❌ GraphQL client not available in auth-init plugin')
      return
    }
    console.log('Auth init plugin loaded')
    if (!authStore.initialized) {
      await authStore.fetchUser()
    }
  }
})
