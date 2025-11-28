<script setup lang="ts">
import { useUserSocialAccountStore } from '~/stores/user_social_account'
import type { UserSocialAccount, UserSocialAccountInput } from '~/types/core_types'

const toast = useToast()

// Social Account state
const socialAccountStore = useUserSocialAccountStore()
const showSocialAccountModal = ref(false)
const editingSocialAccountId = ref<string | null>(null)
const socialAccountLoading = ref(false)
const showDeleteSocialAccountModal = ref(false)
const deletingSocialAccountId = ref<string | null>(null)

interface SocialProvider {
  id: string
  label: string
  icon: string
  color: string
  placeholder: string
}

const socialProviders = ref<SocialProvider[]>([
  { 
    id: 'github',
    label: 'GitHub',
    icon: 'i-simple-icons-github', 
    color: 'text-gray-900 dark:text-white',
    placeholder: 'your-username'
  },
  { 
    id: 'linkedin',
    label: 'LinkedIn', 
    icon: 'i-simple-icons-linkedin', 
    color: 'text-blue-700',
    placeholder: 'your-profile'
  },
  { 
    id: 'twitter',
    label: 'Twitter/X', 
    icon: 'i-simple-icons-x', 
    color: 'text-gray-900 dark:text-white',
    placeholder: '@your handle'
  },
  { 
    id: 'instagram',
    label: 'Instagram', 
    icon: 'i-simple-icons-instagram', 
    color: 'text-pink-600',
    placeholder: '@yourhandle'
  },
  { 
    id: 'facebook',
    label: 'Facebook', 
    icon: 'i-simple-icons-facebook', 
    color: 'text-blue-600',
    placeholder: 'your-profile'
  },
  { 
    id: 'youtube',
    label: 'YouTube', 
    icon: 'i-simple-icons-youtube', 
    color: 'text-red-600',
    placeholder: '@yourchannel'
  },
  { 
    id: 'tiktok',
    label: 'TikTok', 
    icon: 'i-simple-icons-tiktok', 
    color: 'text-gray-900 dark:text-white',
    placeholder: '@yourhandle'
  },
  { 
    id: 'dribbble',
    label: 'Dribbble', 
    icon: 'i-simple-icons-dribbble', 
    color: 'text-pink-500',
    placeholder: 'your-username'
  },
  { 
    id: 'behance',
    label: 'Behance', 
    icon: 'i-simple-icons-behance', 
    color: 'text-blue-600',
    placeholder: 'your-username'
  },
  { 
    id: 'medium',
    label: 'Medium', 
    icon: 'i-simple-icons-medium', 
    color: 'text-gray-900 dark:text-white',
    placeholder: '@your handle'
  },
  { 
    id: 'dev',
    label: 'Dev.to', 
    icon: 'i-simple-icons-devdotto', 
    color: 'text-gray-900 dark:text-white',
    placeholder: 'your-username'
  },
  { 
    id: 'stackoverflow',
    label: 'Stack Overflow', 
    icon: 'i-simple-icons-stackoverflow', 
    color: 'text-orange-600',
    placeholder: 'user/12345'
  }
])

// Social Account form data
const socialAccountForm = ref<UserSocialAccountInput>({
  provider: socialProviders.value[0]?.id || 'github',
  username: ''
})

// Social Account functions
function openSocialAccountModal() {
  editingSocialAccountId.value = null
  socialAccountForm.value = {
    provider: socialProviders.value[0]?.id || 'github',
    username: ''
  }
  showSocialAccountModal.value = true
}

function editSocialAccount(account: UserSocialAccount) {
  editingSocialAccountId.value = account.id
  socialAccountForm.value = {
    provider: account.provider,
    username: account.username
  }
  showSocialAccountModal.value = true
}

function resetSocialAccountForm() {
  socialAccountForm.value = {
    provider: socialProviders.value[0]?.id || 'github',
    username: ''
  }
  editingSocialAccountId.value = null
}

const selectedProvider = computed(() => {
  return socialProviders.value.find(p => p.id === socialAccountForm.value.provider)
})

async function saveSocialAccount() {
  if (!socialAccountForm.value.provider || !socialAccountForm.value.username) {
    toast.add({
      title: 'Validation Error',
      description: 'Please fill in provider and username',
      color: 'error'
    })
    return
  }
  
  socialAccountLoading.value = true
  
  try {
    let result
    if (editingSocialAccountId.value) {
      result = await socialAccountStore.updateUserSocialAccount(editingSocialAccountId.value, socialAccountForm.value)
    } else {
      result = await socialAccountStore.createUserSocialAccount(socialAccountForm.value)
    }
    
    if (result.success) {
      toast.add({
        title: 'Success',
        description: editingSocialAccountId.value ? 'Social account updated successfully!' : 'Social account added successfully!',
        color: 'success'
      })
      showSocialAccountModal.value = false
      resetSocialAccountForm()
    } else {
      toast.add({
        title: 'Error',
        description: result.error || 'Failed to save social account',
        color: 'error'
      })
    }
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.message || 'Failed to save social account',
      color: 'error'
    })
  } finally {
    socialAccountLoading.value = false
  }
}

function confirmDeleteSocialAccount(id: string) {
  deletingSocialAccountId.value = id
  showDeleteSocialAccountModal.value = true
}

async function deleteSocialAccount() {
  if (!deletingSocialAccountId.value) return
  
  socialAccountLoading.value = true
  
  try {
    const result = await socialAccountStore.deleteUserSocialAccount(deletingSocialAccountId.value)
    
    if (result.success) {
      toast.add({
        title: 'Success',
        description: 'Social account deleted successfully!',
        color: 'success'
      })
      showDeleteSocialAccountModal.value = false
      deletingSocialAccountId.value = null
    } else {
      toast.add({
        title: 'Error',
        description: result.error || 'Failed to delete social account',
        color: 'error'
      })
    }
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.message || 'Failed to delete social account',
      color: 'error'
    })
  } finally {
    socialAccountLoading.value = false
  }
}

function getProviderInfo(providerId: string) {
  return socialProviders.value.find(p => p.id === providerId) || socialProviders.value[0]
}

onMounted(async () => {
  await socialAccountStore.fetchUserSocialAccounts()
})
</script>

<template>
<div>
  <!-- User Social Accounts Section -->
  <ClientOnly>
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Social Accounts</h3>
          <UButton
            icon="i-lucide-plus"
            label="Add Account"
            @click="openSocialAccountModal"
          />
        </div>
      </template>
      
      <div v-if="socialAccountStore.userSocialAccounts.length === 0">
         <UEmpty 
            title="No social accounts added yet" 
            description="Add your social media accounts to your profile" 
            icon="i-lucide-share-2" 
            size="lg" 
          />
      </div>
      
      <div v-else class="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <UCard
          v-for="account in socialAccountStore.userSocialAccounts"
          :key="account.id"
          class="transition hover:shadow-xl hover:-translate-y-1 duration-200"
          :ui="{body: 'p-0 sm:p-2'}"
        >
          <!-- Provider Icon -->
          <div class="flex items-center justify-center">
            <UIcon
              :name="getProviderInfo(account.provider)?.icon"
              :class="getProviderInfo(account.provider)?.color"
              class="w-12 h-12"
            />
          </div>
          
          <div class="flex flex-col items-center justify-center mt-3 space-y-1">
            <h4 class="font-semibold text-lg capitalize">{{ getProviderInfo(account.provider)?.label }}</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400 truncate max-w-full px-2">{{ account.username }}</p>
          </div>

          <!-- Actions -->
          <template #footer>
            <div class="flex justify-between">
              <UButton
                icon="i-lucide-trash"
                size="lg"
                color="error"
                variant="soft"
                @click="confirmDeleteSocialAccount(account.id)"
              />
              <ULink :href="`https://www.${account.provider}.com/${account.username}`" target="_blank">
                <UButton
                  icon="i-lucide-link"
                  size="lg"
                  variant="soft"
                />
              </ULink>
              <UButton
                icon="i-lucide-pencil"
                size="lg"
                variant="soft"
                @click="editSocialAccount(account)"
              />
            </div>
          </template>
        </UCard>
      </div>

    </UCard>
  </ClientOnly>

  <!-- Delete Social Account Modal -->
  <UModal v-model:open="showDeleteSocialAccountModal" title="Delete Social Account" description="Are you sure you want to delete this social account?">
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          label="Cancel"
          variant="ghost"
          @click="showDeleteSocialAccountModal = false"
        />
        <UButton
          label="Delete"
          color="error"
          :loading="socialAccountLoading"
          @click="deleteSocialAccount"
        />
      </div>
    </template>
  </UModal>

  <!-- Add/Edit Social Account Modal -->
  <UModal v-model:open="showSocialAccountModal" :title="editingSocialAccountId ? 'Edit Social Account' : 'Add Social Account'">
    <template #body>
      <div class="space-y-4">
        <UFormField label="Social Platform" required>
          <USelectMenu
            v-model="socialAccountForm.provider"
            :items="socialProviders"
            value-key="id"
            placeholder="Select platform"
            size="lg"
            class="w-full"
          >
            <template #leading>
              <UIcon
                v-if="selectedProvider"
                :name="selectedProvider.icon"
                :class="selectedProvider.color"
                class="w-5 h-5"
              />
            </template>
          </USelectMenu>
        </UFormField>

        <UFormField label="Username/Handle" required>
          <UInput
            v-model="socialAccountForm.username"
            :placeholder="selectedProvider?.placeholder || 'your-username'"
            icon="i-lucide-at-sign"
            size="lg"
            class="w-full"
          />
        </UFormField>
      </div>
    </template>
    <template #footer>
      <div class="w-full flex justify-end gap-3">
        <UButton
          :label="editingSocialAccountId ? 'Update' : 'Add'"
          @click="saveSocialAccount"
          :loading="socialAccountLoading"
        />
      </div>
    </template>
  </UModal>
</div>
</template>
