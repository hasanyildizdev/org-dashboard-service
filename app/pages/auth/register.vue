<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'
import AppLogo from '~/components/AppLogo.vue'
const config = useRuntimeConfig()
definePageMeta({
  title: 'Sign Up',
  layout: 'auth',
  middleware: 'guest'
})

const toast = useToast()
const loading = ref(false)
const providers = [{
  label: 'Google',
  icon: 'i-simple-icons-google',
  onClick: () => {
    toast.add({ title: 'Google', description: 'Sign up with Google' })
  }
}, {
  label: 'GitHub',
  icon: 'i-simple-icons-github',
  onClick: () => {
    toast.add({ title: 'GitHub', description: 'Sign up with GitHub' })
  }
}]

const fields: AuthFormField[] = [{
  name: 'name',
  type: 'text',
  label: 'Full Name',
  placeholder: 'Enter your full name',
  required: true
}, {
  name: 'email',
  type: 'email',
  label: 'Email',
  placeholder: 'Enter your email',
  required: true
}, {
  name: 'password',
  label: 'Password',
  type: 'password',
  placeholder: 'Create a password',
  required: true
}, {
  name: 'password_confirmation',
  label: 'Confirm Password',
  type: 'password',
  placeholder: 'Confirm your password',
  required: true
}, {
  name: 'acceptTerms',
  label: 'I agree to the Terms of Service and Privacy Policy',
  type: 'checkbox',
  required: true
}]

const schema = z.object({
  name: z.string({ required_error: 'Name is required' }).min(2, 'Name must be at least 2 characters'),
  email: z.string({ required_error: 'Email is required' }).email('Invalid email'),
  password: z.string({ required_error: 'Password is required' }).min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  password_confirmation: z.string({ required_error: 'Password confirmation is required' }),
  acceptTerms: z.boolean({ required_error: 'You must accept the terms and conditions' })
    .refine(val => val === true, 'You must accept the terms and conditions')
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
})

type Schema = z.output<typeof schema>

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  loading.value = true
  try {
    // TODO: Implement registration mutation when ready
    toast.add({ 
      title: 'Coming Soon', 
      description: 'Registration functionality will be available soon',
      color: 'primary'
    })
  } catch (error: any) {
    toast.add({ 
      title: 'Error', 
      description: error.message || 'Registration failed',
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
                            title="Create your account"
                            @submit="onSubmit">
                            <template #description>
                                Already have an account? <ULink to="/auth/login" class="text-primary font-medium">Sign in</ULink>.
                            </template>
                            <template #validation>
                                <UAlert color="error" icon="i-lucide-info" title="Error creating account" />
                            </template>
                            <template #footer>
                                <div class="text-sm text-center text-gray-600 dark:text-gray-400">
                                    By creating an account, you agree to our 
                                    <ULink :to="config.public.websiteUrl + '/terms-of-service'" class="text-primary font-medium">Terms of Service</ULink>
                                    and 
                                    <ULink :to="config.public.websiteUrl + '/privacy-policy'" class="text-primary font-medium">Privacy Policy</ULink>.
                                </div>
                            </template>
                        </UAuthForm>
                    </UPageCard>
                </div>
            </UContainer>
        </UPageBody>
    </UPage>
</template>