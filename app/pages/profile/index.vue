<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useUserEducationStore } from '~/stores/user_education'

definePageMeta({
  title: 'Profile',
})

const user = computed(() => useAuthStore().user)
const educationStore = useUserEducationStore()
await educationStore.fetchUserEducations()
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
        <UDashboardNavbar title="Profile">
            <template #leading>
                <UDashboardSidebarCollapse variant="subtle" />
            </template>
        </UDashboardNavbar>
      </template>
      <template #body>
          <UContainer class="p-6">
            <div class="space-y-6">
              
              <!-- User Information Card -->
              <UCard>
                <template #header>
                  <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3">
                      <div class="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center text-white text-2xl font-bold">
                        <img v-if="user?.avatar" :src="user.avatar" alt="Avatar" class="w-16 h-16 rounded-full">
                        <span v-else>{{ user?.name?.charAt(0).toUpperCase() }}</span>
                      </div>
                      <div>
                        <h3 class="text-xl font-semibold">{{ user?.name }}</h3>
                        <p class="text-sm text-gray-500">{{ user?.email }}</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-3">
                      <UButton 
                        label="Edit Profile" 
                        icon="i-lucide-user-pen"
                        color="primary"
                        variant="soft"
                        size="lg"
                        block
                        to="/profile/edit"
                      />
                      <UButton 
                        label="Logout" 
                        trailing
                        icon="i-lucide-log-out"
                        color="error"
                        variant="soft"
                        size="lg"
                        block
                        @click="useAuthStore().logout"
                      />
                    </div>
                  </div>
                </template>

                <div class="space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p class="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <p class="font-medium mt-1">{{ user?.email }}</p>
                    </div>
                    
                    <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p class="text-sm text-gray-500 dark:text-gray-400">Profession</p>
                      <p class="font-medium mt-1">{{ user?.profession?.name || 'Not specified' }}</p>
                    </div>
                    
                    <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p class="text-sm text-gray-500 dark:text-gray-400">Account Created</p>
                      <p class="font-medium mt-1">{{ new Date(user?.created_at || '').toLocaleDateString() }}</p>
                    </div>
                    
                  </div>
                </div>
              </UCard>

              <!-- Education Section -->
              <UCard v-if="educationStore.userEducations.length > 0">
                <template #header>
                  <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold">Education</h3>
                    <UButton
                      label="Edit"
                      icon="i-lucide-pencil"
                      size="sm"
                      variant="ghost"
                      to="/profile/edit#education"
                    />
                  </div>
                </template>

                <div class="space-y-4">
                  <div 
                    v-for="education in educationStore.userEducations" 
                    :key="education.id"
                    class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div class="flex items-start justify-between">
                      <div class="flex-1">
                        <h4 class="font-semibold text-base">{{ education.institution }}</h4>
                        <p v-if="education.degree || education.field_of_study" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <span v-if="education.degree">{{ education.degree }}</span>
                          <span v-if="education.degree && education.field_of_study"> in </span>
                          <span v-if="education.field_of_study">{{ education.field_of_study }}</span>
                        </p>
                        <div class="flex items-center gap-2 mt-2 text-sm text-gray-500">
                          <UIcon name="i-lucide-calendar" class="w-4 h-4" />
                          <span>{{ education.education_period }}</span>
                        </div>
                        <div v-if="education.city || education.country" class="flex items-center gap-2 mt-1 text-sm text-gray-500">
                          <UIcon name="i-lucide-map-pin" class="w-4 h-4" />
                          <span>{{ [education.city, education.country].filter(Boolean).join(', ') }}</span>
                        </div>
                        <p v-if="education.grade" class="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          <span class="font-medium">Grade:</span> {{ education.grade }}
                        </p>
                        <p v-if="education.description" class="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          {{ education.description }}
                        </p>
                      </div>
                      <UBadge v-if="education.is_current" color="primary" variant="soft">
                        Current
                      </UBadge>
                    </div>
                  </div>
                </div>
              </UCard>
            </div>
          </UContainer>
      </template>
  </UDashboardPanel>
</template>
