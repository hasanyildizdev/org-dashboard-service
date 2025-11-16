<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()
const loading = ref(false)

const user = computed(() => authStore.user)

// Password form state
const passwordForm = ref({
  current_password: '',
  new_password: '',
  confirm_password: ''
})

// Notification settings
const notifications = ref({
  email_notifications: true,
  push_notifications: false,
  sms_notifications: false,
  marketing_emails: false
})

// Privacy settings
const privacy = ref({
  profile_visibility: 'public',
  show_email: false,
  show_activity: true
})

const passwordSchema = z.object({
  current_password: z.string().min(8, 'Password must be at least 8 characters'),
  new_password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Must contain uppercase, lowercase, and number'),
  confirm_password: z.string()
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
})

type PasswordSchema = z.output<typeof passwordSchema>

async function onPasswordSubmit(event: Event) {
  event.preventDefault()
  loading.value = true
  
  try {
    // TODO: Implement change password mutation when backend is ready
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    
    toast.add({
      title: 'Success',
      description: 'Password changed successfully!',
      color: 'success'
    })
    
    // Reset form
    passwordForm.value = {
      current_password: '',
      new_password: '',
      confirm_password: ''
    }
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.message || 'Failed to change password',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

async function saveNotificationSettings() {
  try {
    // TODO: Implement save notification settings when backend is ready
    await new Promise(resolve => setTimeout(resolve, 500))
    
    toast.add({
      title: 'Success',
      description: 'Notification settings saved!',
      color: 'success'
    })
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to save settings',
      color: 'error'
    })
  }
}

async function savePrivacySettings() {
  try {
    // TODO: Implement save privacy settings when backend is ready
    await new Promise(resolve => setTimeout(resolve, 500))
    
    toast.add({
      title: 'Success',
      description: 'Privacy settings saved!',
      color: 'success'
    })
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to save settings',
      color: 'error'
    })
  }
}
</script>

<template>
  <UDashboardPanel resizable>
      <template #resize-handle="{ onMouseDown, onTouchStart, onDoubleClick }">
          <UDashboardResizeHandle
              class="after:absolute after:inset-y-0 after:right-0 after:w-px hover:after:bg-(--ui-border-accented) after:transition"
              @mousedown="onMouseDown"
              @touchstart="onTouchStart"
              @dblclick="onDoubleClick"
          />
      </template>
      <template #header>
        <UDashboardNavbar title="Settings">
            <template #leading>
                <UDashboardSidebarCollapse variant="subtle" />
            </template>
        </UDashboardNavbar>
      </template>
      <template #body>
          <UContainer class="p-6">
            <div class="max-w-2xl mx-auto space-y-6">
              <!-- Back Button -->
              <div>
                <UButton
                  icon="i-lucide-arrow-left"
                  label="Back to Profile"
                  variant="ghost"
                  @click="router.push('/bio/profile')"
                />
              </div>

              <!-- Change Password -->
              <UCard>
                <template #header>
                  <div class="flex items-center gap-2">
                    <UIcon name="i-lucide-lock" class="w-5 h-5" />
                    <h3 class="text-lg font-semibold">Change Password</h3>
                  </div>
                </template>
                
                <form @submit.prevent="onPasswordSubmit">
                  <div class="space-y-4">
                    <UFormGroup
                      label="Current Password"
                      name="current_password"
                      required
                    >
                      <UInput
                        v-model="passwordForm.current_password"
                        type="password"
                        placeholder="Enter current password"
                        size="lg"
                        :disabled="loading"
                      />
                    </UFormGroup>

                    <UFormGroup
                      label="New Password"
                      name="new_password"
                      required
                    >
                      <UInput
                        v-model="passwordForm.new_password"
                        type="password"
                        placeholder="Enter new password"
                        size="lg"
                        :disabled="loading"
                      />
                    </UFormGroup>

                    <UFormGroup
                      label="Confirm New Password"
                      name="confirm_password"
                      required
                    >
                      <UInput
                        v-model="passwordForm.confirm_password"
                        type="password"
                        placeholder="Confirm new password"
                        size="lg"
                        :disabled="loading"
                      />
                    </UFormGroup>

                    <UAlert 
                      color="info"
                      icon="i-lucide-shield"
                      title="Password Requirements"
                      description="Must be at least 8 characters with uppercase, lowercase, and numbers."
                    />
                  </div>

                  <div class="flex justify-end mt-6">
                    <UButton
                      type="submit"
                      label="Change Password"
                      color="primary"
                      :loading="loading"
                    />
                  </div>
                </form>
              </UCard>

              <!-- Notification Settings -->
              <UCard>
                <template #header>
                  <div class="flex items-center gap-2">
                    <UIcon name="i-lucide-bell" class="w-5 h-5" />
                    <h3 class="text-lg font-semibold">Notifications</h3>
                  </div>
                </template>
                
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium">Email Notifications</p>
                      <p class="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <UToggle v-model="notifications.email_notifications" />
                  </div>

                  <UDivider />

                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium">Push Notifications</p>
                      <p class="text-sm text-gray-500">Receive push notifications in browser</p>
                    </div>
                    <UToggle v-model="notifications.push_notifications" />
                  </div>

                  <UDivider />

                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium">SMS Notifications</p>
                      <p class="text-sm text-gray-500">Receive notifications via SMS</p>
                    </div>
                    <UToggle v-model="notifications.sms_notifications" />
                  </div>

                  <UDivider />

                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium">Marketing Emails</p>
                      <p class="text-sm text-gray-500">Receive promotional emails and updates</p>
                    </div>
                    <UToggle v-model="notifications.marketing_emails" />
                  </div>

                  <div class="flex justify-end mt-6">
                    <UButton
                      label="Save Preferences"
                      color="primary"
                      @click="saveNotificationSettings"
                    />
                  </div>
                </div>
              </UCard>

              <!-- Privacy Settings -->
              <UCard>
                <template #header>
                  <div class="flex items-center gap-2">
                    <UIcon name="i-lucide-shield-check" class="w-5 h-5" />
                    <h3 class="text-lg font-semibold">Privacy</h3>
                  </div>
                </template>
                
                <div class="space-y-4">
                  <UFormGroup label="Profile Visibility" name="profile_visibility">
                    <USelectMenu
                      v-model="privacy.profile_visibility"
                      :options="[
                        { value: 'public', label: 'Public' },
                        { value: 'private', label: 'Private' },
                        { value: 'friends', label: 'Friends Only' }
                      ]"
                      value-attribute="value"
                      option-attribute="label"
                    />
                  </UFormGroup>

                  <UDivider />

                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium">Show Email Address</p>
                      <p class="text-sm text-gray-500">Display your email on your profile</p>
                    </div>
                    <UToggle v-model="privacy.show_email" />
                  </div>

                  <UDivider />

                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium">Show Activity</p>
                      <p class="text-sm text-gray-500">Let others see your activity</p>
                    </div>
                    <UToggle v-model="privacy.show_activity" />
                  </div>

                  <div class="flex justify-end mt-6">
                    <UButton
                      label="Save Privacy Settings"
                      color="primary"
                      @click="savePrivacySettings"
                    />
                  </div>
                </div>
              </UCard>

              <!-- Session Management -->
              <UCard>
                <template #header>
                  <div class="flex items-center gap-2">
                    <UIcon name="i-lucide-monitor-smartphone" class="w-5 h-5" />
                    <h3 class="text-lg font-semibold">Active Sessions</h3>
                  </div>
                </template>
                
                <div class="space-y-4">
                  <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div class="flex items-center gap-3">
                      <UIcon name="i-lucide-monitor" class="w-6 h-6 text-primary" />
                      <div>
                        <p class="font-medium">Current Device</p>
                        <p class="text-sm text-gray-500">{{ user?.email }} • Active now</p>
                      </div>
                    </div>
                    <UBadge label="Active" color="success" />
                  </div>

                  <UAlert
                    color="warning"
                    icon="i-lucide-alert-triangle"
                    title="Session Management"
                    description="Multi-device session management coming soon."
                  />
                </div>
              </UCard>
            </div>
          </UContainer>
      </template>
  </UDashboardPanel>
</template>
