<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useUserEducationStore } from '~/stores/user_education'
import { useUserExperienceStore } from '~/stores/user_experience'
import { useUserSkillStore } from '~/stores/user_skill'
import { useSkillLevelsIcons } from '~/composables/skillLevelsIcons'
import { useUserSocialAccountStore } from '~/stores/user_social_account'

definePageMeta({
  title: 'Profile',
})

const user = computed(() => useAuthStore().user)
const educationStore = useUserEducationStore()
const experienceStore = useUserExperienceStore()
const skillStore = useUserSkillStore()
const socialAccountStore = useUserSocialAccountStore()
const { skillLevelsIcons } = useSkillLevelsIcons()

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

function getSocialColor(provider: string): string {
  const colors: Record<string, string> = {
    github: 'text-gray-900 dark:text-white',
    linkedin: 'text-blue-700',
    twitter: 'text-gray-900 dark:text-white',
    instagram: 'text-pink-600',
    facebook: 'text-blue-600',
    youtube: 'text-red-600',
    tiktok: 'text-gray-900 dark:text-white',
    dribbble: 'text-pink-500',
    behance: 'text-blue-600',
    medium: 'text-gray-900 dark:text-white',
    dev: 'text-gray-900 dark:text-white',
    stackoverflow: 'text-orange-600'
  }
  return colors[provider.toLowerCase()] || 'text-gray-600'
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
                      <ULink to="/cv" target="_blank">
                        <UButton 
                          label="View CV" 
                          icon="i-lucide-file-text"
                          color="primary"
                          variant="soft"
                          size="lg"
                          trailing
                          block
                        />
                      </ULink>
                      <ULink to="/cv2" target="_blank">
                        <UButton 
                          label="View CV2" 
                          icon="i-lucide-file-text"
                          color="primary"
                          variant="soft"
                          size="lg"
                          trailing
                          block
                        />
                      </ULink>
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

              <!-- Experience Section -->
              <UCard v-if="experienceStore.userExperiences.length > 0">
                <template #header>
                  <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold">Experience</h3>
                    <UButton
                      label="Edit"
                      icon="i-lucide-pencil"
                      size="sm"
                      variant="ghost"
                      to="/profile/edit#experience"
                    />
                  </div>
                </template>

                <div class="space-y-4">
                  <div 
                    v-for="experience in experienceStore.userExperiences" 
                    :key="experience.id"
                    class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div class="flex items-start justify-between">
                      <div class="flex-1">
                        <h4 class="font-semibold text-base">{{ experience.title }}</h4>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {{ experience.company }}
                        </p>
                        <div class="flex items-center gap-2 mt-2 text-sm text-gray-500">
                          <UIcon name="i-lucide-calendar" class="w-4 h-4" />
                          <span>{{ experience.experience_period }}</span>
                        </div>
                        <div v-if="experience.city || experience.country" class="flex items-center gap-2 mt-1 text-sm text-gray-500">
                          <UIcon name="i-lucide-map-pin" class="w-4 h-4" />
                          <span>{{ [experience.city, experience.country].filter(Boolean).join(', ') }}</span>
                        </div>
                        <p v-if="experience.description" class="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          {{ experience.description }}
                        </p>
                      </div>
                      <UBadge v-if="experience.is_current" color="primary" variant="soft">
                        Current
                      </UBadge>
                    </div>
                  </div>
                </div>
              </UCard>

              <!-- User Skills Card -->
              <UCard v-if="skillStore.userSkills.length > 0">
                <template #header>
                  <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold">Skills</h3>
                    <NuxtLink to="/profile/edit">
                      <UButton 
                        icon="i-lucide-pencil" 
                        size="sm"
                        variant="ghost"
                        label="Edit"
                      />
                    </NuxtLink>
                  </div>
                </template>
                <div class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  <UCard
                    v-for="skill in skillStore.userSkills"
                    :key="skill.id"
                    class="transition hover:shadow-xl hover:-translate-y-1 duration-200"
                    :ui="{body: 'p-0 sm:p-2'}"
>
                    <!-- Skill Level -->
                    <div class="flex items-center justify-center">
                      <UBadge
                        :class="skillLevelsIcons[skill.level as keyof typeof skillLevelsIcons].color"
                        :icon="skillLevelsIcons[skill.level as keyof typeof skillLevelsIcons].icon"
                        variant="soft"
                        size="xl"
                        class="capitalize"
                      >
                        {{ skill.level }}
                      </UBadge>
                     </div>
                    <div class="flex items-center justify-center mt-3">
                        <h4 class="font-semibold text-lg truncate">{{ skill.name }}</h4>
                        <UIcon v-if="skill.is_primary" 
                            name="tabler:pinned-filled" 
                            variant="solid" 
                            class="text-blue-500 size-5"/>
                     </div>
                  </UCard>
                </div>
              </UCard>

              <!-- User Social Accounts Card -->
              <UCard>
                <template #header>
                  <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold">Social Accounts</h3>
                    <NuxtLink to="/profile/edit">
                      <UButton 
                        icon="i-lucide-pencil" 
                        size="sm"
                        variant="ghost"
                        label="Edit"
                      />
                    </NuxtLink>
                  </div>
                </template>
                
                <div v-if="socialAccountStore.userSocialAccounts.length === 0" class="text-center py-8 text-gray-500">
                  <UIcon name="i-lucide-share-2" class="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>No social accounts added yet</p>
                </div>
                
                <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div 
                    v-for="account in socialAccountStore.userSocialAccounts" 
                    :key="account.id"
                    class="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-800 rounded-lg"
                  >
                    <UIcon 
                      :name="getSocialIcon(account.provider)" 
                      class="w-6 h-6"
                      :class="getSocialColor(account.provider)"
                    />
                    <div class="flex-1 min-w-0">
                      <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">{{ account.provider }}</p>
                      <p class="font-medium truncate">{{ account.username }}</p>
                    </div>
                  </div>
                </div>
              </UCard>
            </div>
          </UContainer>
      </template>
  </UDashboardPanel>
</template>
