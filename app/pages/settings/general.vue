<script setup lang="ts">
const colorMode = useColorMode()
const { locale, locales } = useI18n()

// Settings state
const settings = ref({
  theme: colorMode.value,
  language: locale.value,
  emailNotifications: true,
  pushNotifications: false,
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

const toast = useToast()

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
    emailNotifications: true,
    pushNotifications: false,
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
      <UDashboardNavbar title="General Settings">
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
                    <UFormGroup label="Compact Mode" help="Reduce spacing and padding">
                      <UToggle v-model="settings.compactMode" />
                    </UFormGroup>
                  </div>
                  
                  <div>
                    <UFormGroup label="Show Avatars" help="Display user profile pictures">
                      <UToggle v-model="settings.showAvatars" />
                    </UFormGroup>
                  </div>
                  
                  <div>
                    <UFormGroup label="Animations" help="Enable smooth transitions and animations">
                      <UToggle v-model="settings.animationsEnabled" />
                    </UFormGroup>
                  </div>

                  <div>
                    <UFormGroup label="Sound Effects" help="Play notification sounds">
                      <UToggle v-model="settings.soundEnabled" />
                    </UFormGroup>
                  </div>
                </div>
              </div>
            </UCard>
          </div>

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
                <UFormGroup label="Language">
                  <USelect
                    v-model="settings.language"
                    :options="languageOptions"
                    placeholder="Select language"
                  />
                </UFormGroup>

                <UFormGroup label="Timezone">
                  <USelect
                    v-model="settings.timezone"
                    :options="timezoneOptions"
                    placeholder="Select timezone"
                  />
                </UFormGroup>

                <UFormGroup label="Date Format">
                  <USelect
                    v-model="settings.dateFormat"
                    :options="dateFormatOptions"
                    placeholder="Select date format"
                  />
                </UFormGroup>

                <UFormGroup label="Time Format">
                  <USelect
                    v-model="settings.timeFormat"
                    :options="timeFormatOptions"
                    placeholder="Select time format"
                  />
                </UFormGroup>

                <UFormGroup label="Currency">
                  <USelect
                    v-model="settings.currency"
                    :options="currencyOptions"
                    placeholder="Select currency"
                  />
                </UFormGroup>
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
                  <UToggle v-model="settings.emailNotifications" />
                </div>

                <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div class="flex-1">
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white">Push Notifications</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Get instant notifications on your device</p>
                  </div>
                  <UToggle v-model="settings.pushNotifications" />
                </div>

                <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div class="flex-1">
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white">Marketing Emails</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Receive product updates and newsletters</p>
                  </div>
                  <UToggle v-model="settings.marketingEmails" />
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
