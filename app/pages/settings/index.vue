<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import * as z from 'zod'

definePageMeta({
  title: 'Settings',
})

const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()
const loading = ref(false)
const colorMode = useColorMode()
const { locale, locales } = useI18n()
const user = computed(() => authStore.user)
type PasswordSchema = z.output<typeof passwordSchema>

// Password form state
const passwordForm = ref({
  current_password: '',
  new_password: '',
  confirm_password: ''
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

// Privacy settings
const privacy = ref({
  profile_visibility: 'public',
  show_email: false,
  show_activity: true
})

// Settings state
const settings = ref({
  theme: colorMode.value,
  language: locale.value,
  marketingEmails: false,
  soundEnabled: true,
  autoSave: true,
  compactMode: false,
  showAvatars: true,
  animationsEnabled: true,
  timezone: 'America/New_York',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  currency: 'USD',
  numberFormat: 'US'
})

// Notification settings
const notifications = ref({
  email_notifications: true,
  push_notifications: false,
  sms_notifications: false,
  marketing_emails: false
})

// Available options
const themeOptions = [
  { label: 'Light', value: 'light', icon: 'i-lucide-sun' },
  { label: 'Dark', value: 'dark', icon: 'i-lucide-moon' },
  { label: 'System', value: 'system', icon: 'i-lucide-monitor' }
]

const languageOptions = [
  { label: 'English', value: 'en', flag: '🇺🇸' },
  { label: 'Spanish', value: 'es', flag: '🇪🇸' },
  { label: 'French', value: 'fr', flag: '🇫🇷' },
  { label: 'German', value: 'de', flag: '🇩🇪' },
  { label: 'Turkish', value: 'tr', flag: '🇹🇷' },
  { label: 'Japanese', value: 'ja', flag: '🇯🇵' }
]

const timezoneOptions = [
  { label: 'Eastern Time (ET)', value: 'America/New_York' },
  { label: 'Central Time (CT)', value: 'America/Chicago' },
  { label: 'Mountain Time (MT)', value: 'America/Denver' },
  { label: 'Pacific Time (PT)', value: 'America/Los_Angeles' },
  { label: 'Greenwich Mean Time (GMT)', value: 'Europe/London' },
  { label: 'Central European Time (CET)', value: 'Europe/Paris' },
  { label: 'Turkey Time (TRT)', value: 'Europe/Istanbul' }
]

const dateFormatOptions = [
  { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
  { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
  { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
  { label: 'DD MMM YYYY', value: 'DD MMM YYYY' }
]

const timeFormatOptions = [
  { label: '12-hour (AM/PM)', value: '12h' },
  { label: '24-hour', value: '24h' }
]

const currencyOptions = [
  { label: 'US Dollar (USD)', value: 'USD', symbol: '$' },
  { label: 'Euro (EUR)', value: 'EUR', symbol: '€' },
  { label: 'British Pound (GBP)', value: 'GBP', symbol: '£' },
  { label: 'Turkish Lira (TRY)', value: 'TRY', symbol: '₺' },
  { label: 'Japanese Yen (JPY)', value: 'JPY', symbol: '¥' }
]

// Watchers for reactive changes
watch(() => settings.value.theme, (newTheme) => {
  colorMode.preference = newTheme
  toast.add({
    title: 'Theme Updated',
    description: `Switched to ${newTheme} mode`,
    icon: 'i-lucide-palette'
  })
})

watch(() => settings.value.language, (newLanguage) => {
  // In a real app, you'd change the locale here
  toast.add({
    title: 'Language Changed',
    description: `Language set to ${languageOptions.find(l => l.value === newLanguage)?.label}`,
    icon: 'i-lucide-globe'
  })
})

function resetSettings() {
  settings.value = {
    theme: 'system',
    language: 'en',
    marketingEmails: false,
    soundEnabled: true,
    autoSave: true,
    compactMode: false,
    showAvatars: true,
    animationsEnabled: true,
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    currency: 'USD',
    numberFormat: 'US'
  }
  
  toast.add({
    title: 'Settings Reset',
    description: 'All settings have been restored to defaults',
    icon: 'i-lucide-rotate-ccw'
  })
}

function saveSettings() {
  // In a real app, you'd save to backend here
  toast.add({
    title: 'Settings Saved',
    description: 'Your preferences have been updated successfully',
    icon: 'i-lucide-check-circle',
    color: 'success'
  })
}


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
        <template #trailing>
          <div class="flex items-center gap-2">
            <UButton
              variant="outline"
              color="neutral"
              size="sm"
              icon="i-lucide-rotate-ccw"
              @click="resetSettings"
            >
              Reset
            </UButton>
            <UButton
              variant="solid"
              color="primary"
              size="sm"
              icon="i-lucide-save"
              @click="saveSettings"
            >
              Save Changes
            </UButton>
          </div>
        </template>
      </UDashboardNavbar>
    </template>
    
    <template #body>
      <div class="h-full">
        <UContainer class="py-6 px-6 max-w-4xl">
          
          <!-- Appearance Settings -->
          <div class="mb-8">
            <UCard>
              <template #header>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <UIcon name="i-lucide-palette" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h2>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Customize the look and feel of your dashboard</p>
                  </div>
                </div>
              </template>

              <div class="space-y-6">
                <!-- Theme Selection -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Theme Mode
                  </label>
                  <div class="grid grid-cols-3 gap-3">
                    <div
                      v-for="theme in themeOptions"
                      :key="theme.value"
                      @click="settings.theme = theme.value"
                      :class="[
                        'p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 text-center',
                        settings.theme === theme.value
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      ]"
                    >
                      <UIcon :name="theme.icon" class="w-8 h-8 mx-auto mb-2" />
                      <div class="text-sm font-medium">{{ theme.label }}</div>
                    </div>
                  </div>
                </div>

                <!-- Display Options -->
                <div class="grid md:grid-cols-2 gap-6">
                  <div>
                    <UFormField label="Compact Mode" help="Reduce spacing and padding">
                      <UToggle v-model="settings.compactMode" />
                    </UFormField>
                  </div>
                  
                  <div>
                    <UFormField label="Show Avatars" help="Display user profile pictures">
                      <UToggle v-model="settings.showAvatars" />
                    </UFormField>
                  </div>
                  
                  <div>
                    <UFormField label="Animations" help="Enable smooth transitions and animations">
                      <UToggle v-model="settings.animationsEnabled" />
                    </UFormField>
                  </div>

                  <div>
                    <UFormField label="Sound Effects" help="Play notification sounds">
                      <UToggle v-model="settings.soundEnabled" />
                    </UFormField>
                  </div>
                </div>
              </div>
            </UCard>
          </div>

          <!-- Change Password -->
          <UCard class="my-6">
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-lock" class="w-5 h-5" />
                <h3 class="text-lg font-semibold">Change Password</h3>
              </div>
            </template>
            
            <form @submit.prevent="onPasswordSubmit">
              <div class="space-y-4">
                <UFormField
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
                </UFormField>

                <UFormField
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
                </UFormField>

                <UFormField
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
                </UFormField>

                <UAlert 
                  color="info"
                  icon="i-lucide-shield"
                  title="Password Requirements"
                  description="Must be at least 8 characters with uppercase, lowercase, and numbers."
                  class="mt-2"
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
          <UCard class="my-6">
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
          <UCard class="my-6">
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-shield-check" class="w-5 h-5" />
                <h3 class="text-lg font-semibold">Privacy</h3>
              </div>
            </template>
            
            <div class="space-y-4">
              <UFormField label="Profile Visibility" name="profile_visibility">
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
              </UFormField>

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
          
          <!-- Language & Region -->
          <div class="mb-8">
            <UCard>
              <template #header>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <UIcon name="i-lucide-globe" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Language & Region</h2>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Set your preferred language and regional formats</p>
                  </div>
                </div>
              </template>

              <div class="grid md:grid-cols-2 gap-6">
                <UFormField label="Language">
                  <USelect
                    v-model="settings.language"
                    :options="languageOptions"
                    placeholder="Select language"
                  />
                </UFormField>

                <UFormField label="Timezone">
                  <USelect
                    v-model="settings.timezone"
                    :options="timezoneOptions"
                    placeholder="Select timezone"
                  />
                </UFormField>

                <UFormField label="Date Format">
                  <USelect
                    v-model="settings.dateFormat"
                    :options="dateFormatOptions"
                    placeholder="Select date format"
                  />
                </UFormField>

                <UFormField label="Time Format">
                  <USelect
                    v-model="settings.timeFormat"
                    :options="timeFormatOptions"
                    placeholder="Select time format"
                  />
                </UFormField>

                <UFormField label="Currency">
                  <USelect
                    v-model="settings.currency"
                    :options="currencyOptions"
                    placeholder="Select currency"
                  />
                </UFormField>
              </div>
            </UCard>
          </div>

          <!-- Notifications -->
          <div class="mb-8">
            <UCard>
              <template #header>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <UIcon name="i-lucide-bell" class="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Manage how you receive notifications</p>
                  </div>
                </div>
              </template>

              <div class="space-y-4">
                <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div class="flex-1">
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Receive updates via email</p>
                  </div>
                  <UToggle v-model="notifications.email_notifications" />
                </div>

                <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div class="flex-1">
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white">Push Notifications</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Get instant notifications on your device</p>
                  </div>
                  <UToggle v-model="notifications.push_notifications" />
                </div>

                <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div class="flex-1">
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white">Marketing Emails</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Receive product updates and newsletters</p>
                  </div>
                  <UToggle v-model="notifications.marketing_emails" />
                </div>
              </div>
            </UCard>
          </div>

          <!-- Advanced Settings -->
          <div class="mb-8">
            <UCard>
              <template #header>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <UIcon name="i-lucide-settings" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Advanced</h2>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Additional system preferences</p>
                  </div>
                </div>
              </template>

              <div class="space-y-4">
                <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div class="flex-1">
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white">Auto-save</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Automatically save your work</p>
                  </div>
                  <UToggle v-model="settings.autoSave" />
                </div>
              </div>
            </UCard>
          </div>

          <!-- Danger Zone -->
          <div class="mb-8">
            <UCard>
              <template #header>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <UIcon name="i-lucide-alert-triangle" class="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Danger Zone</h2>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Irreversible and destructive actions</p>
                  </div>
                </div>
              </template>

              <div class="space-y-4">
                <div class="p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/10">
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="text-sm font-medium text-red-900 dark:text-red-100">Reset All Settings</h3>
                      <p class="text-sm text-red-700 dark:text-red-300">This will restore all settings to their default values</p>
                    </div>
                    <UButton
                      variant="outline"
                      color="error"
                      size="sm"
                      icon="i-lucide-rotate-ccw"
                      @click="resetSettings"
                    >
                      Reset
                    </UButton>
                  </div>
                </div>
              </div>
            </UCard>
          </div>

        </UContainer>
      </div>
    </template>
  </UDashboardPanel>
</template>
