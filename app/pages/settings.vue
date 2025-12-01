<script setup lang="ts">
definePageMeta({
  title: 'Settings',
})

const toast = useToast()
const colorMode = useColorMode()
const { locale, locales, setLocale } = useI18n()

// Settings state
const settings = ref({
  theme: colorMode.value,
  language: locale.value,
})

// Available options
const themeOptions = [
  { label: 'Light', value: 'light', icon: 'i-lucide-sun' },
  { label: 'Dark', value: 'dark', icon: 'i-lucide-moon' },
  { label: 'System', value: 'system', icon: 'i-lucide-monitor' }
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

// Save locale when it changes
watch(locale, (newLocale) => {
  localStorage.setItem('ourganize-session-language', newLocale)
})

// Restore saved locale on mount
onMounted(() => {
  const savedLocale = localStorage.getItem('ourganize-session-language')
  const validLocales = ['tr', 'en', 'de', 'fr', 'es']
  if (savedLocale && validLocales.includes(savedLocale)) {
    setLocale(savedLocale as 'tr' | 'en' | 'de' | 'fr' | 'es')
  }
})
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
                  </div>
                </div>
              </template>

              <div class="flex items-center gap-3">
                <p>Dark/Light Mode</p>
                <UColorModeSwitch color="primary"/>
              </div>

            </UCard>

            <!-- Language-->
            <UCard class="my-6">
               <template #header>
                  <h3 class="text-lg font-semibold">Language</h3>
               </template>
               <ULocaleSelect 
                  v-model="locale" 
                  :locales="locales as any" 
                  class="w-48"
                  size="xl"
                />
            </UCard>
          </div>
        </UContainer>
      </div>
    </template>
  </UDashboardPanel>
</template>
