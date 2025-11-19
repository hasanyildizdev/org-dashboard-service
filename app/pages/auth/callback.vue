<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  title: 'Authentication',
  layout: 'auth',
  middleware: 'guest'
})

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
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
    // Store the token
    const authToken = useCookie('auth_token', {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax'
    })
    authToken.value = token

    console.log('Token stored:', token.substring(0, 20) + '...')

    // Small delay to ensure cookie is set
    await new Promise(resolve => setTimeout(resolve, 100))

    // Fetch user data with retries
    let retries = 3
    let fetchSuccess = false
    
    while (retries > 0 && !fetchSuccess) {
      try {
        await authStore.fetchUser()
        
        if (authStore.user) {
          fetchSuccess = true
          console.log('User fetched successfully:', authStore.user.email)
          
          toast.add({
            title: 'Success!',
            description: `Welcome back, ${authStore.user.name}! 🎉`,
            color: 'success'
          })

          // Redirect to profile
          await router.push('/bio/profile')
        } else {
          retries--
          if (retries > 0) {
            console.log(`User fetch returned null, retrying... (${retries} attempts left)`)
            await new Promise(resolve => setTimeout(resolve, 500))
          }
        }
      } catch (fetchErr: any) {
        console.error('Fetch attempt failed:', fetchErr)
        retries--
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      }
    }
    
    if (!fetchSuccess) {
      throw new Error('Failed to fetch user data after multiple attempts')
    }
  } catch (err: any) {
    console.error('Social auth callback error:', err)
    error.value = err.message || 'Authentication failed'
    
    toast.add({
      title: 'Authentication Failed',
      description: error.value,
      color: 'error'
    })

    // Clear the invalid token
    const authToken = useCookie('auth_token')
    authToken.value = null

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
