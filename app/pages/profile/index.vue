<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useProfileStore } from '~/stores/profile'
definePageMeta({
  title: 'Profile',
})
const user = computed(() => useAuthStore().user)
const professions = computed(() => useProfileStore().professions)
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
                      <p class="font-medium mt-1">{{ professions.find((p: any) => p.id === user?.profession_id)?.name || 'Not specified' }}</p>
                    </div>
                    
                    <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p class="text-sm text-gray-500 dark:text-gray-400">Account Created</p>
                      <p class="font-medium mt-1">{{ new Date(user?.created_at || '').toLocaleDateString() }}</p>
                    </div>
                    
                  </div>
                </div>
              </UCard>
            </div>
          </UContainer>
      </template>
  </UDashboardPanel>
</template>
