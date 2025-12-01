<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useUserEducationStore } from '~/stores/user_education'
import { useUserExperienceStore } from '~/stores/user_experience'
import { useUserSkillStore } from '~/stores/user_skill'
import { useUserSocialAccountStore } from '~/stores/user_social_account'

definePageMeta({
  title: 'Profile',
})

const user = computed(() => useAuthStore().user)
const educationStore = useUserEducationStore()
const experienceStore = useUserExperienceStore()
const skillStore = useUserSkillStore()
const socialAccountStore = useUserSocialAccountStore()

await Promise.all([
  educationStore.fetchUserEducations(),
  experienceStore.fetchUserExperiences(),
  skillStore.fetchUserSkills(),
  socialAccountStore.fetchUserSocialAccounts()
])

// Helper functions for social account icons and colors
function getSocialIcon(provider: string): string {
  const icons: Record<string, string> = {
    github: 'i-simple-icons-github',
    linkedin: 'i-simple-icons-linkedin',
    twitter: 'i-simple-icons-x',
    instagram: 'i-simple-icons-instagram',
    facebook: 'i-simple-icons-facebook',
    youtube: 'i-simple-icons-youtube',
    tiktok: 'i-simple-icons-tiktok',
    dribbble: 'i-simple-icons-dribbble',
    behance: 'i-simple-icons-behance',
    medium: 'i-simple-icons-medium',
    dev: 'i-simple-icons-devdotto',
    stackoverflow: 'i-simple-icons-stackoverflow'
  }
  return icons[provider.toLowerCase()] || 'i-lucide-link'
}

// Calculate profile completion percentage dynamically
const profile_completion_messages: string[] = []
const profile_progress = computed(() => {
  let completedFields = 0
  const totalFields = 5
  
  // Check if profession is completed
  if (user.value?.profession) {
    completedFields++
  } else {
    profile_completion_messages.push('Add your profession')
  }
  
  // Check if education is completed
  if (educationStore.userEducations.length > 0) {
    completedFields++
  } else {
    profile_completion_messages.push('Add your education')
  }
  
  // Check if experiences is completed
  if (experienceStore.userExperiences.length > 0) {
    completedFields++
  } else {
    profile_completion_messages.push('Add your work experience')
  }
  
  // Check if skills is completed
  if (skillStore.userSkills.length > 0) {
    completedFields++
  } else {  
    profile_completion_messages.push('Add your skills')
  }
  
  // Check if social accounts is completed
  if (socialAccountStore.userSocialAccounts.length > 0) {
    completedFields++
  } else {
    profile_completion_messages.push('Add your social accounts')
  }
  
  return Math.round((completedFields / totalFields) * 100)
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
                    <div class="space-y-2">
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
                      
                    </div>
                    <div class="flex items-center gap-3">
                      <UButton 
                        label="Settings" 
                        icon="mdi:cog"
                        color="primary"
                        variant="soft"
                        size="lg"
                        trailing
                        to="/settings"
                      />
                      <UButton 
                        label="Edit Profile" 
                        icon="i-lucide-user-pen"
                        color="primary"
                        variant="soft"
                        size="lg"
                        trailing
                        to="/profile/edit"
                      />
                      <UButton 
                        label="Logout" 
                        trailing
                        icon="i-lucide-log-out"
                        color="error"
                        variant="soft"
                        size="lg"
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

              <UCard class="border-gray-200 dark:border-gray-700">
                  <template #header>
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <div class="p-2 bg-blue-500 dark:bg-blue-600 rounded-lg">
                          <UIcon name="i-lucide-file-text" class="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Resume Builder</h3>
                          <p class="text-sm text-gray-600 dark:text-gray-400">Professional CV Templates</p>
                        </div>
                      </div>
                    </div>
                  </template>
                  
                  <div class="space-y-4">
                    <!-- CV Template Cards -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div class="group">
                        <div class="p-4 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:border-blue-500 hover:shadow-lg bg-white dark:bg-gray-900">
                          <div class="flex items-center justify-between">
                            <div>
                              <h4 class="font-medium text-sm text-gray-900 dark:text-white">Classic Template</h4>
                              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Traditional professional layout</p>
                            </div>
                            <div class="flex items-center gap-2">
                              <UButton 
                              label="Share" 
                              icon="i-lucide-share-2"
                              color="neutral"
                              variant="outline"
                              />
                              <ULink to="/cv" target="_blank">
                                <UButton 
                                  label="View CV" 
                                  icon="i-lucide-external-link"
                                  color="primary"
                                  variant="solid"
                                  trailing
                                  class="w-full transition-all duration-200 group-hover:scale-105"
                                />
                              </ULink>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="group">
                        <div class="p-4 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:border-purple-500 hover:shadow-lg bg-white dark:bg-gray-900">
                          <div class="flex items-center justify-between">
                            <div>
                              <h4 class="font-medium text-sm text-gray-900 dark:text-white">Modern Template</h4>
                              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Contemporary creative design</p>
                            </div>
                            <div class="flex items-center gap-2">
                              <UButton 
                                label="Share" 
                                icon="i-lucide-share-2"
                                color="neutral"
                                variant="outline"
                                />
                              <ULink to="/cv2" target="_blank">
                                <UButton 
                                  label="View CV" 
                                  icon="i-lucide-external-link"
                                  color="primary"
                                  variant="solid"
                                  trailing
                                  class="w-full transition-all duration-200 group-hover:scale-105"
                                />
                              </ULink>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Compact Progress Section -->
                    <ClientOnly>
                      <div class="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                        <div class="flex items-center justify-between mb-2">
                          <div class="flex items-center gap-2">
                            <UIcon 
                              :name="profile_progress >= 80 ? 'i-lucide-trophy' : profile_progress >= 50 ? 'i-lucide-trending-up' : 'i-lucide-alert-circle'"
                              :class="profile_progress >= 80 ? 'text-green-500' : profile_progress >= 50 ? 'text-amber-500' : 'text-red-500'"
                              class="w-4 h-4"
                            />
                            <span class="text-sm font-medium text-gray-900 dark:text-white">
                              {{ profile_progress >= 80 ? 'Excellent!' : profile_progress >= 50 ? 'Good progress!' : 'Keep going!' }}
                            </span>
                          </div>
                          <UPopover>
                            <UButton 
                              icon="i-lucide-info"
                              color="gray" 
                              variant="ghost" 
                              size="xs"
                            />
                            <template #content>
                              <div class="p-2 max-w-xs">
                                <h4 class="font-medium text-sm mb-2">Profile Completion:</h4>
                                <div class="space-y-1">
                                  <p v-for="message in profile_completion_messages" :key="message" class="text-xs text-gray-600 dark:text-gray-400">
                                    • {{ message }}
                                  </p>
                                </div>
                              </div>
                            </template>
                          </UPopover>
                        </div>
                        
                        <UProgress 
                          v-model="profile_progress" 
                          size="sm" 
                          :color="profile_progress >= 80 ? 'success' : profile_progress >= 50 ? 'warning' : 'error'"
                        />
                      </div>
                    </ClientOnly>
                  </div>
              </UCard>

            </div>
          </UContainer>
      </template>
  </UDashboardPanel>
</template>
