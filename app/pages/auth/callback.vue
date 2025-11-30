<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  title: 'Authentication',
  layout: 'auth',
  middleware: 'guest'
})

const router = useRouter()
const route = useRoute()
const toast = useToast()

const processing = ref(true)
const error = ref('')

onMounted(async () => {
  const token = route.query.token as string
  const errorParam = route.query.error as string

  if (errorParam) {
    error.value = errorParam
    toast.add({
      title: 'Authentication Failed',
      description: errorParam,
      color: 'error'
    })
    
    setTimeout(() => {
      router.push('/auth/login')
    }, 3000)
    processing.value = false
    return
  }

  if (!token) {
    error.value = 'No authentication token received'
    toast.add({
      title: 'Authentication Failed',
      description: 'No authentication token received',
      color: 'error'
    })
    
    setTimeout(() => {
      router.push('/auth/login')
    }, 3000)
    processing.value = false
    return
  }

  try {

    // Call server API to set httpOnly cookie and get user data
    const authStore = useAuthStore()
    
    const response = await $fetch<{ success: boolean, user: any }>('/api/auth/callback', {
      method: 'POST',
      body: { token }
    })
    
    if (!response.success || !response.user) {
      throw new Error('Failed to authenticate with server')
    }

    // Set user in store
    authStore.setUser(response.user)
    
    toast.add({
      title: 'Success!',
      description: `Welcome back, ${response.user.name}! 🎉`,
      color: 'success'
    })

    // Small delay for UX
    await new Promise(resolve => setTimeout(resolve, 500))

    // Redirect to profile
    await router.push('/profile')
  } catch (err: any) {
    console.error('Social auth callback error:', err)
    error.value = err?.data?.message || err.message || 'Authentication failed'
    
    toast.add({
      title: 'Authentication Failed',
      description: error.value,
      color: 'error'
    })

    setTimeout(() => {
      router.push('/auth/login')
    }, 3000)
  } finally {
    processing.value = false
  }
})
</script>

<template>
  <UPage>
    <UPageBody>
      <UContainer>
        <div class="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <UPageCard class="w-full max-w-md text-center">
            <div class="p-8">
              <div v-if="processing" class="flex flex-col items-center gap-4">
                <UIcon name="i-lucide-loader-circle" class="w-12 h-12 animate-spin text-primary" />
                <h2 class="text-2xl font-semibold">Completing authentication...</h2>
                <p class="text-gray-600 dark:text-gray-400">Please wait while we log you in</p>
              </div>

              <div v-else-if="error" class="flex flex-col items-center gap-4">
                <UIcon name="i-lucide-circle-x" class="w-12 h-12 text-error" />
                <h2 class="text-2xl font-semibold text-error">Authentication Failed</h2>
                <p class="text-gray-600 dark:text-gray-400">{{ error }}</p>
                <p class="text-sm text-gray-500">Redirecting to login page...</p>
              </div>

              <div v-else class="flex flex-col items-center gap-4">
                <UIcon name="i-lucide-check-circle" class="w-12 h-12 text-success" />
                <h2 class="text-2xl font-semibold text-success">Success!</h2>
                <p class="text-gray-600 dark:text-gray-400">Redirecting to your profile...</p>
              </div>
            </div>
          </UPageCard>
        </div>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
