import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin({
  name: 'auth-init',
  parallel: false,
  async setup(nuxtApp) {
    const authStore = useAuthStore()
    
    // Initialize auth state on app load (client-side only)
    if (import.meta.client) {
      // Wait a tick to ensure other plugins have loaded
      await new Promise(resolve => setTimeout(resolve, 0))
      
      // Make sure $graphql is available
      if (!nuxtApp.$graphql) {
        console.error('❌ GraphQL client not available in auth-init plugin')
        console.log('⏭️ Skipping auth initialization - will happen on first navigation')
        return
      }
      await authStore.fetchUser()
    }
  }
})
