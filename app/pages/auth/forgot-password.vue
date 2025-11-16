<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'
import AppLogo from '~/components/AppLogo.vue'

definePageMeta({
    layout: 'auth',
    title: 'Forgot Password'
})

const toast = useToast()

const fields: AuthFormField[] = [{
  name: 'email',
  type: 'email',
  label: 'Email',
  placeholder: 'Enter your email address',
  required: true
}]

const schema = z.object({
  email: z.string({ required_error: 'Email is required' }).email('Invalid email address')
})

type Schema = z.output<typeof schema>

function onSubmit(payload: FormSubmitEvent<Schema>) {
  console.log('Password reset requested for:', payload.data.email)
  toast.add({
    title: 'Reset Link Sent!',
    description: 'If an account exists with this email, you will receive password reset instructions.',
    color: 'success'
  })
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
                            title="Reset your password"
                            submit-label="Send Reset Link"
                            @submit="onSubmit">
                            <template #description>
                                <div class="text-center text-gray-600 dark:text-gray-400 mb-4">
                                    Enter your email address and we'll send you a link to reset your password.
                                </div>
                            </template>
                            <template #validation>
                                <UAlert color="error" icon="i-lucide-info" title="Error sending reset link" />
                            </template>
                            <template #footer>
                                <div class="flex flex-col gap-3 text-center">
                                    <div class="text-sm text-gray-600 dark:text-gray-400">
                                        Remember your password? 
                                        <ULink to="/auth/login" class="text-primary font-medium">Back to login</ULink>
                                    </div>
                                    <div class="text-sm text-gray-600 dark:text-gray-400">
                                        Don't have an account? 
                                        <ULink to="/auth/register" class="text-primary font-medium">Sign up</ULink>
                                    </div>
                                </div>
                            </template>
                        </UAuthForm>
                    </UPageCard>
                </div>
            </UContainer>
        </UPageBody>
    </UPage>
</template>