<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})

const { t } = useI18n()

const handleError = () => clearError({ redirect: '/' })

const is404 = computed(() => props.error?.statusCode === 404)
const errorTitle = computed(() => {
  if (is404.value) {
    return t('Page Not Found')
  }
  return t('An Error Occurred')
})

const errorMessage = computed(() => {
  if (is404.value) {
    return t("The page you're looking for doesn't exist or has been moved.")
  }
  return props.error?.message || t('Something went wrong.')
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 px-6">
    <div class="max-w-2xl w-full text-center">
      <!-- Error Code with Animation -->
      <div class="mb-8 relative">
        <h1 class="text-9xl md:text-[12rem] font-bold text-gray-200 dark:text-gray-800 select-none">
          {{ error?.statusCode || '500' }}
        </h1>
        <div class="absolute inset-0 flex items-center justify-center">
          <UIcon 
            :name="is404 ? 'heroicons:magnifying-glass' : 'heroicons:exclamation-triangle'" 
            class="w-24 h-24 md:w-32 md:h-32 text-primary dark:text-white opacity-80"
          />
        </div>
      </div>

      <!-- Error Message -->
      <div class="mb-8 space-y-4">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          {{ errorTitle }}
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
          {{ errorMessage }}
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          @click="handleError"
          class="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <UIcon name="heroicons:home" class="w-5 h-5 mr-2" />
          {{ t('Go Home') }}
        </button>
        
        <button
          @click="$router.back()"
          class="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 border border-gray-300 dark:border-gray-700 rounded-lg transition-all duration-300"
        >
          <UIcon name="heroicons:arrow-left" class="w-5 h-5 mr-2" />
          {{ t('Go Back') }}
        </button>
      </div>

      <!-- Additional Help (Optional) -->
      <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ t('Need help?') }}
          <NuxtLink 
            to="/contact" 
            class="text-primary hover:text-primary/80 dark:text-white dark:hover:text-primary/80 font-medium transition-colors duration-300 ml-1"
          >
            {{ t('Contact us') }}
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
