<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useProfileStore } from '~/stores/profile'
import * as z from 'zod'

definePageMeta({
  title: 'Edit Profile',
})

const router = useRouter()
const toast = useToast()
const loading = ref(false)
const deleteLoading = ref(false)
const showDeleteModal = ref(false)

const user = computed(() => useAuthStore().user)

// Professions state
const profileStore = useProfileStore()
await profileStore.fetchProfessions()

// Form state
const formData = ref({
  name: user.value?.name || '',
  email: user.value?.email || '',
  profession_id: user.value?.profession_id || null
})

// Selected profession for USelectMenu
const selectedProfession = computed({
  get: () => {
    const profession = profileStore.professions.find((jt: any) => jt.id === formData.value.profession_id)
    return profession ? { label: profession.name, value: profession.id } : undefined
  },
  set: (value: any) => {
    formData.value.profession_id = value?.value || null
  }
})

// Watch for user changes
watch(user, (newUser) => {
  if (newUser) {
    formData.value.name = newUser.name
    formData.value.email = newUser.email
    formData.value.profession_id = newUser.profession_id || null
  }
}, { immediate: true })

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address')
})

type Schema = z.output<typeof schema>

const fields = [
  {
    name: 'name',
    type: 'text',
    label: 'Full Name',
    placeholder: 'Enter your full name',
    required: true
  },
  {
    name: 'email',
    type: 'email',
    label: 'Email Address',
    placeholder: 'Enter your email',
    required: true
  }
]

async function onSubmit(event: Event) {
  event.preventDefault()
  loading.value = true
  
  try {    
    await useProfileStore().updateProfile(formData.value.name, formData.value.email, formData.value.profession_id)
    toast.add({
      title: 'Success',
      description: 'Profile updated successfully!',
      color: 'success'
    })
    
    // Redirect back to profile
    router.push('/profile')
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.message || 'Failed to update profile',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

async function confirmDeleteAccount() {
  showDeleteModal.value = true
}

async function deleteAccount() {
  deleteLoading.value = true
  try {
    await useProfileStore().deleteAccount()
    toast.add({
      title: 'Account Deleted',
      description: 'Your account has been permanently deleted.',
      color: 'success'
    })
    
    // Redirect to home/login after short delay
    setTimeout(() => {
      router.push('/auth/login')
    }, 1500)
  } catch (error: any) {
    console.error('Delete account error:', error)
    toast.add({
      title: 'Error',
      description: error.message || 'Failed to delete account',
      color: 'error'
    })
  } finally {
    deleteLoading.value = false
    showDeleteModal.value = false
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
        <UDashboardNavbar title="Edit Profile">
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
                  @click="router.push('/profile')"
                />
              </div>

              <!-- Profile Picture Section -->
              <UCard>
                <template #header>
                  <h3 class="text-lg font-semibold">Profile Picture</h3>
                </template>
                
                <div class="flex items-center gap-6">
                  <div class="w-24 h-24 rounded-full bg-primary-500 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                    <img
                      v-if="user?.avatar"
                      :src="user.avatar"
                      class="w-full h-full object-cover"
                      />
                      <span v-else>
                        {{ user?.name?.charAt(0)?.toUpperCase() }}
                      </span>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm text-gray-500 mb-2">
                      JPG, GIF or PNG. Max size of 2MB
                    </p>
                    <div class="flex gap-2">
                      <UButton 
                        label="Upload Photo" 
                        color="primary"
                        size="sm"
                        disabled
                      />
                      <UButton 
                        label="Remove" 
                        color="error"
                        variant="ghost"
                        size="sm"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </UCard>

              <!-- Edit Profile Form -->
              <UCard>
                <template #header>
                  <h3 class="text-lg font-semibold">Personal Information</h3>
                </template>
                
                <form @submit.prevent="onSubmit">
                  <div class="space-y-4">
                    <UFormField
                      label="Full Name"
                      name="name"
                      required
                    >
                      <UInput
                        v-model="formData.name"
                        placeholder="Enter your full name"
                        size="lg"
                        :disabled="loading"
                      />
                    </UFormField>

                    <UFormField
                      label="Email Address"
                      name="email"
                      required
                    >
                      <UInput
                        v-model="formData.email"
                        type="email"
                        placeholder="Enter your email"
                        size="lg"
                        :disabled="loading"
                      />
                    </UFormField>

                    <UFormField
                      label="Profession"
                      name="profession_id"
                    >
                      <USelectMenu
                        v-model="selectedProfession"
                        :items="profileStore.professions.map((jt: any) => ({ label: jt.name, value: jt.id }))"
                        placeholder="Select your profession"
                        :loading="profileStore.loading"
                        :disabled="loading"
                        size="lg"
                      />
                    </UFormField>

                    <UAlert 
                      color="info"
                      icon="i-lucide-info"
                      title="Note"
                      description="Changes to your email will require verification."
                      class="mt-4"
                    />
                  </div>

                  <div class="flex justify-end gap-3 mt-6">
                    <UButton
                      label="Cancel"
                      color="neutral"
                      variant="ghost"
                      @click="router.push('/profile')"
                      :disabled="loading"
                    />
                    <UButton
                      type="submit"
                      label="Save Changes"
                      color="primary"
                      :loading="loading"
                    />
                  </div>
                </form>
              </UCard>

              <!-- Danger Zone -->
              <UCard>
                <template #header>
                  <h3 class="text-lg font-semibold text-red-600">Danger Zone</h3>
                </template>
                
                <div class="space-y-4">
                  <div>
                    <h4 class="font-medium mb-1">Delete Account</h4>
                    <p class="text-sm text-gray-500 mb-3">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <UButton
                      label="Delete Account"
                      color="error"
                      variant="outline"
                      icon="i-lucide-trash-2"
                      @click="confirmDeleteAccount"
                      :loading="deleteLoading"
                    />
                  </div>
                </div>
              </UCard>
            </div>
          </UContainer>
      </template>
  </UDashboardPanel>

  <!-- Delete Account Confirmation Modal -->
  <UModal v-if="showDeleteModal" v-model="showDeleteModal">
    <UCard>
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
            <UIcon name="i-lucide-alert-triangle" class="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 class="text-lg font-semibold">Delete Account</h3>
            <p class="text-sm text-gray-500">This action cannot be undone</p>
          </div>
        </div>
      </template>

      <div class="space-y-4">
        <p class="text-gray-700 dark:text-gray-300">
          Are you absolutely sure you want to delete your account? This will:
        </p>
        <ul class="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li>Permanently delete your profile</li>
          <li>Remove all your data</li>
          <li>Revoke all active sessions</li>
          <li>This action cannot be reversed</li>
        </ul>
        <UAlert
          color="error"
          icon="i-lucide-shield-alert"
          title="Warning"
          description="All your data will be permanently deleted."
        />
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton
            label="Cancel"
            color="neutral"
            variant="ghost"
            @click="showDeleteModal = false"
            :disabled="deleteLoading"
          />
          <UButton
            label="Delete My Account"
            color="error"
            @click="deleteAccount"
            :loading="deleteLoading"
          />
        </div>
      </template>
    </UCard>
  </UModal>
</template>
