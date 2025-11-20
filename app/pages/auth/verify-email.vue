<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useEmailVerification } from '~/composables/useEmailVerification'

definePageMeta({
  title: 'Verify Email',
  layout: 'auth',
  middleware: 'auth'
})

const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()
const { resendVerificationEmail } = useEmailVerification()

const COOLDOWN_KEY = 'email_verification_cooldown'
const COOLDOWN_DURATION = 60 // seconds

const resending = ref(false)
const loggingOut = ref(false)
const cooldown = ref(0)
let cooldownInterval: number | null = null

// Initialize cooldown from localStorage
const initializeCooldown = () => {
  const storedCooldownEnd = localStorage.getItem(COOLDOWN_KEY)
  
  if (storedCooldownEnd) {
    const cooldownEnd = parseInt(storedCooldownEnd)
    const now = Date.now()
    const remainingSeconds = Math.ceil((cooldownEnd - now) / 1000)
    
    if (remainingSeconds > 0) {
      cooldown.value = remainingSeconds
      startCooldownTimer()
    } else {
      // Expired, clean up
      localStorage.removeItem(COOLDOWN_KEY)
    }
  }
}

// Start cooldown timer
const startCooldownTimer = () => {
  if (cooldownInterval) {
    clearInterval(cooldownInterval)
  }
  
  cooldownInterval = setInterval(() => {
    cooldown.value--
    
    if (cooldown.value <= 0) {
      clearInterval(cooldownInterval!)
      cooldownInterval = null
      localStorage.removeItem(COOLDOWN_KEY)
    }
  }, 1000)
}

// Handle resend verification email
const handleResend = async () => {
  if (cooldown.value > 0 || resending.value) return

  resending.value = true
  
  const result = await resendVerificationEmail()
  
  resending.value = false

  if (result.success) {
    // Store cooldown end time in localStorage
    const cooldownEnd = Date.now() + (COOLDOWN_DURATION * 1000)
    localStorage.setItem(COOLDOWN_KEY, cooldownEnd.toString())
    
    // Start cooldown
    cooldown.value = COOLDOWN_DURATION
    startCooldownTimer()
  }
}

// Handle logout
const handleLogout = async () => {
  loggingOut.value = true
  
  try {
    await authStore.logout()
    
    // Clear cooldown
    localStorage.removeItem(COOLDOWN_KEY)
    
    toast.add({
      title: 'Logged Out',
      description: 'You have been logged out successfully',
      color: 'success'
    })
    
    router.push('/auth/login')
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to logout',
      color: 'error'
    })
  } finally {
    loggingOut.value = false
  }
}

// Check if email is already verified and initialize cooldown
onMounted(() => {
  if (authStore.user?.email_verified_at) {
    router.push('/bio/profile')
    return
  }
  
  initializeCooldown()
})

// Cleanup interval on unmount
onUnmounted(() => {
  if (cooldownInterval) {
    clearInterval(cooldownInterval)
  }
})
</script>

<template>
  <UPage>
    <UPageBody>
      <UContainer>
        <div class="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <UPageCard class="w-full max-w-md">
            <div class="p-8 text-center space-y-6">
              <!-- Icon -->
              <div class="flex justify-center">
                <UIcon 
                  name="i-lucide-mail-check" 
                  class="w-20 h-20 text-primary"
                />
              </div>

              <!-- Title -->
              <div>
                <h1 class="text-2xl font-bold mb-2">Verify Your Email</h1>
                <p class="text-gray-600 dark:text-gray-400">
                  We've sent a verification link to<br/>
                  <strong class="text-gray-900 dark:text-white">{{ authStore.user?.email }}</strong>
                </p>
              </div>

              <!-- Instructions -->
              <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  <strong class="text-gray-900 dark:text-white">Next steps:</strong>
                </p>
                <ol class="text-sm text-gray-600 dark:text-gray-400 space-y-2 mt-2 list-decimal list-inside">
                  <li>Check your email inbox</li>
                  <li>Click the verification link in the email</li>
                  <li>Return here to access your account</li>
                </ol>
              </div>

              <!-- Resend Button -->
              <div>
                <UButton
                  @click="handleResend"
                  :disabled="resending || cooldown > 0"
                  :loading="resending"
                  color="primary"
                  variant="outline"
                  size="lg"
                  block
                >
                  <template v-if="cooldown > 0">
                    Resend in {{ cooldown }}s
                  </template>
                  <template v-else>
                    Resend Verification Email
                  </template>
                </UButton>
                
                <p class="text-xs text-gray-500 mt-2">
                  Didn't receive the email? Check your spam folder or click resend.
                </p>
              </div>

              <!-- Divider -->
              <UDivider />

              <!-- Logout Button -->
              <div>
                <UButton
                  @click="handleLogout"
                  :loading="loggingOut"
                  :disabled="loggingOut"
                  color="neutral"
                  variant="ghost"
                  size="sm"
                  block
                >
                  <UIcon name="i-lucide-log-out" class="mr-2" />
                  Logout
                </UButton>
                <p class="text-xs text-gray-500 mt-2 text-center">
                  Need to use a different account?
                </p>
              </div>
            </div>
          </UPageCard>
        </div>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
