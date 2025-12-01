<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useProfileStore } from '~/stores/profile'
import * as z from 'zod'

// Professions state
const profileStore = useProfileStore()
await profileStore.fetchProfessions()

const router = useRouter()
const toast = useToast()
const loading = ref(false)
const deleteLoading = ref(false)
const showDeleteModal = ref(false)
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

const user = computed(() => useAuthStore().user)

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

async function onSubmit(event: Event) {
  event.preventDefault()
  loading.value = true
  
  try {    
    const professionId = formData.value.profession_id ? Number(formData.value.profession_id) : undefined
    await useProfileStore().updateProfile(formData.value.name, formData.value.email, professionId as any)
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
</script>
<template>
    <div>
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
                <!-- Delete Account Confirmation Modal -->
                <UModal 
                    v-model="showDeleteModal"
                    title="Delete Account"
                    description="This action cannot be undone"
                    color="error">
                    <UButton
                    label="Delete Account"
                    color="error"
                    variant="outline"
                    icon="i-lucide-trash-2"
                    @click="confirmDeleteAccount"
                    :loading="deleteLoading"
                    />
                    <template #body>
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
                    </template>
                    <template #footer>
                    <div class="w-full flex justify-end gap-3">
                        <UButton
                        label="Delete My Account"
                        color="error"
                        @click="deleteAccount"
                        :loading="deleteLoading"
                        />
                    </div>
                    </template>
                </UModal>
                </div>
            </div>
        </UCard>
    </div>
</template>