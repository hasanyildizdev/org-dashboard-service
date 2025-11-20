<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useEmailVerification } from '~/composables/useEmailVerification'

definePageMeta({
  title: 'Email Verified',
  layout: 'auth'
})

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()
const { verifyEmail } = useEmailVerification()

const verifying = ref(true)
const verified = ref(false)
const error = ref('')

onMounted(async () => {
  const id = route.query.id as string
  const hash = route.query.hash as string
  const expires = route.query.expires as string
  const signature = route.query.signature as string
  
  // Validate all required parameters
  if (!id || !hash || !expires || !signature) {
    error.value = 'Invalid verification link. Missing required parameters.'
    verifying.value = false
    return
  }

  try {
    const result = await verifyEmail({ id, hash, expires, signature })

    if (result.success) {
      verified.value = true
      
      toast.add({
        title: 'Email Verified!',
        description: result.data?.message || 'Email verified successfully!',
        color: 'success'
      })

      // Refresh user data to get updated email_verified_at
      await authStore.fetchUser()

      // Redirect to profile after 2 seconds
      setTimeout(() => {
        if (authStore.isAuthenticated) {
          router.push('/bio/profile')
        } else {
          router.push('/auth/login')
        }
      }, 2000)
    } else {
      error.value = result.error || 'Verification failed'
    }
  } catch (err: any) {
    error.value = err.message || 'An error occurred during verification'
  } finally {
    verifying.value = false
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
              <!-- Verifying State -->
              <div v-if="verifying" class="flex flex-col items-center gap-4">
                <UIcon name="i-lucide-loader-circle" class="w-12 h-12 animate-spin text-primary" />
                <h2 class="text-2xl font-semibold">Verifying your email...</h2>
                <p class="text-gray-600 dark:text-gray-400">Please wait a moment</p>
              </div>

              <!-- Success State -->
              <div v-else-if="verified" class="flex flex-col items-center gap-4">
                <UIcon name="i-lucide-check-circle-2" class="w-16 h-16 text-success" />
                <h2 class="text-2xl font-semibold text-success">Email Verified!</h2>
                <p class="text-gray-600 dark:text-gray-400">
                  Your email has been successfully verified.
                </p>
                <p class="text-sm text-gray-500">
                  Redirecting to your profile...
                </p>
              </div>

              <!-- Error State -->
              <div v-else-if="error" class="flex flex-col items-center gap-4">
                <UIcon name="i-lucide-circle-x" class="w-12 h-12 text-error" />
                <h2 class="text-2xl font-semibold text-error">Verification Failed</h2>
                <p class="text-gray-600 dark:text-gray-400">{{ error }}</p>
                
                <div class="flex gap-3 mt-4">
                  <UButton
                    to="/auth/verify-email"
                    color="primary"
                    size="lg"
                  >
                    Request New Link
                  </UButton>
                  
                  <UButton
                    to="/auth/login"
                    color="neutral"
                    variant="outline"
                    size="lg"
                  >
                    Back to Login
                  </UButton>
                </div>
              </div>
            </div>
          </UPageCard>
        </div>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
