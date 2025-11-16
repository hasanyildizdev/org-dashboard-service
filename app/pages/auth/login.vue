<script setup lang="ts">
import * as z from 'zod'
import AppLogo from '~/components/AppLogo.vue'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'
const config = useRuntimeConfig()

definePageMeta({
  title: 'Sign In',
  layout: 'auth',
  middleware: 'guest'
})

import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()
const loading = ref(false)

const providers = [{
  label: 'Google',
  icon: 'i-simple-icons-google',
  onClick: () => {
    toast.add({ title: 'Google', description: 'Login with Google' })
  }
}, {
  label: 'GitHub',
  icon: 'i-simple-icons-github',
  onClick: () => {
    toast.add({ title: 'GitHub', description: 'Login with GitHub' })
  }
}]

const fields: AuthFormField[] = [{
  name: 'email',
  type: 'email',
  label: 'Email',
  placeholder: 'Enter your email',
  required: true
}, {
  name: 'password',
  label: 'Password',
  type: 'password',
  placeholder: 'Enter your password',
  required: true
}, {
  name: 'remember',
  label: 'Remember me',
  type: 'checkbox'
}]

const schema = z.object({
  email: z.string({ required_error: 'Email is required' }).email('Invalid email'),
  password: z.string({ required_error: 'Password is required' }).min(8, 'Must be at least 8 characters'),
  remember: z.boolean().optional()
})

type Schema = z.output<typeof schema>

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  loading.value = true
  
  try {
    const result = await authStore.login({
      email: payload.data.email,
      password: payload.data.password,
      remember: payload.data.remember
    })

    if (result.success) {
      toast.add({ 
        title: 'Success', 
        description: 'Welcome back! Redirecting to your profile...',
        color: 'success'
      })
      
      // Redirect to profile page after successful login
      await router.push('/bio/profile')
    } else {
      toast.add({ 
        title: 'Error', 
        description: result.error || 'Login failed',
        color: 'error'
      })
    }
  } catch (error: any) {
    toast.add({ 
      title: 'Error', 
      description: error.message || 'An unexpected error occurred',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
    <UPage>
        <UPageBody>
            <UContainer>
                <div class="flex flex-col items-center justify-center gap-4 p-4">
                    <UPageCard class="w-full max-w-md">
                        <AppLogo size="xl" class="mt-4 mb-2"/>
                        <UAuthForm
                            :schema="schema"
                            :fields="fields"
                            :providers="providers"
                            title="Welcome back!"
                            @submit="onSubmit">
                            <template #description>
                            Don't have an account? <ULink to="/auth/register" class="text-primary font-medium">Sign up</ULink>.
                            </template>
                            <template #password-hint>
                            <ULink to="/auth/forgot-password" class="text-primary font-medium" tabindex="-1">Forgot password?</ULink>
                            </template>
                            <template #validation>
                                <UAlert color="error" icon="i-lucide-info" title="Error signing in" />
                            </template>
                            <template #footer>
                                By signing in, you agree to our 
                                <ULink :to="config.public.websiteUrl + '/terms-of-service'" class="text-primary font-medium">Terms of Service</ULink>.
                            </template>
                        </UAuthForm>
                    </UPageCard>
                </div>
            </UContainer>
        </UPageBody>
    </UPage>
</template>
