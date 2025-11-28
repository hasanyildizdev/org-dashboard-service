<script setup lang="ts">
import { useUserExperienceStore } from '~/stores/user_experience'
import type { UserExperience, UserExperienceInput } from '~/types/core_types'

const toast = useToast()

// Experience state
const experienceStore = useUserExperienceStore()
const showExperienceModal = ref(false)
const editingExperienceId = ref<string | null>(null)
const experienceLoading = ref(false)
const showDeleteExperienceModal = ref(false)
const deletingExperienceId = ref<string | null>(null)

// Experience form data
const experienceForm = ref<UserExperienceInput>({
  company: '',
  title: '',
  city: null,
  country: null,
  start_month: null,
  start_year: null,
  end_month: null,
  end_year: null,
  is_current: false,
  description: null
})

const months = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
const currentYear = new Date().getFullYear()
const years = Array.from({ length: 65 }, (_, i) => currentYear - 60 + i) // Generate year options (last 60 years to next 5 years)

// Experience Functions
function openExperienceModal() {
  resetExperienceForm()
  editingExperienceId.value = null
  showExperienceModal.value = true
}

function editExperience(experience: UserExperience) {
  editingExperienceId.value = experience.id
  experienceForm.value = {
    company: experience.company,
    title: experience.title,
    city: experience.city,
    country: experience.country,
    start_month: experience.start_month,
    start_year: experience.start_year,
    end_month: experience.end_month,
    end_year: experience.end_year,
    is_current: experience.is_current,
    description: experience.description
  }
  showExperienceModal.value = true
}

function resetExperienceForm() {
  experienceForm.value = {
    company: '',
    title: '',
    city: null,
    country: null,
    start_month: null,
    start_year: null,
    end_month: null,
    end_year: null,
    is_current: false,
    description: null
  }
}

async function saveExperience() {
  if (!experienceForm.value.company || !experienceForm.value.title) {
    toast.add({
      title: 'Error',
      description: 'Company and Job Title are required',
      color: 'error'
    })
    return
  }

  experienceLoading.value = true

  try {
    let result
    if (editingExperienceId.value) {
      result = await experienceStore.updateUserExperience(editingExperienceId.value, experienceForm.value)
    } else {
      result = await experienceStore.createUserExperience(experienceForm.value)
    }

    if (result.success) {
      toast.add({
        title: 'Success',
        description: editingExperienceId.value ? 'Experience updated successfully' : 'Experience added successfully',
        color: 'success'
      })
      showExperienceModal.value = false
      resetExperienceForm()
    } else {
      toast.add({
        title: 'Error',
        description: result.error || 'Failed to save experience',
        color: 'error'
      })
    }
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.message || 'Failed to save experience',
      color: 'error'
    })
  } finally {
    experienceLoading.value = false
  }
}

function confirmDeleteExperience(id: string) {
  deletingExperienceId.value = id
  showDeleteExperienceModal.value = true
}

async function deleteExperience() {
  if (!deletingExperienceId.value) return

  experienceLoading.value = true

  try {
    const result = await experienceStore.deleteUserExperience(deletingExperienceId.value)

    if (result.success) {
      toast.add({
        title: 'Success',
        description: 'Experience deleted successfully',
        color: 'success'
      })
      showDeleteExperienceModal.value = false
      deletingExperienceId.value = null
    } else {
      toast.add({
        title: 'Error',
        description: result.error || 'Failed to delete experience',
        color: 'error'
      })
    }
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.message || 'Failed to delete experience',
      color: 'error'
    })
  } finally {
    experienceLoading.value = false
  }
}

// Load educations, experiences, on mount (client-only)
onMounted(async () => {
  await experienceStore.fetchUserExperiences()
})
</script>
<template>
    <div>
        <!-- Experience Section -->
        <ClientOnly>
            <UCard id="experience">
                <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold">Experience</h3>
                    <UButton
                    label="Add Experience"
                    icon="i-lucide-plus"
                    trailing
                    @click="openExperienceModal"
                    />
                </div>
                </template>

                <!-- Experience List -->
                <div v-if="experienceStore.userExperiences.length === 0">
                <UEmpty 
                    title="No experience added yet" 
                    description="Add your work experience to your profile" 
                    icon="i-lucide-briefcase" 
                    size="lg" 
                />
                </div>

                <div v-else class="space-y-4">
                <div
                    v-for="experience in experienceStore.userExperiences"
                    :key="experience.id"
                    class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                    <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <div class="flex items-start gap-3">
                        <div class="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                            <UIcon name="i-lucide-briefcase" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div class="flex-1">
                            <h4 class="font-semibold text-lg">{{ experience.title }}</h4>
                            <p class="text-gray-600 dark:text-gray-400 mb-1">{{ experience.company }}</p>
                            <p v-if="experience.city || experience.country" class="text-sm text-gray-500">
                            {{ [experience.city, experience.country].filter(Boolean).join(', ') }}
                            </p>
                            <p class="text-sm text-gray-500 mt-1">
                            {{ experience.experience_period }}
                            </p>
                            <p v-if="experience.description" class="mt-2 text-sm text-gray-700 dark:text-gray-300">
                            {{ experience.description }}
                            </p>
                        </div>
                        </div>
                    </div>
                    <div class="flex gap-1">
                        <UButton
                        icon="i-lucide-pencil"
                        size="sm"
                        color="neutral"
                        variant="ghost"
                        square
                        @click="editExperience(experience)"
                        />
                        <UButton
                        icon="i-lucide-trash-2"
                        size="sm"
                        color="error"
                        variant="ghost"
                        square
                        @click="confirmDeleteExperience(experience.id)"
                        />
                    </div>
                    </div>
                </div>
                </div>
            </UCard>
        </ClientOnly>

        <!-- Experience Modal -->
        <UModal v-model:open="showExperienceModal" :title="editingExperienceId ? 'Edit Experience' : 'Add Experience'">
            <template #body>
                <form @submit.prevent="saveExperience" class="space-y-4">
                <UFormField label="Company" name="company" required>
                    <UInput
                    v-model="experienceForm.company"
                    placeholder="e.g., Google, Microsoft"
                    size="lg"
                    :disabled="experienceLoading"
                    />
                </UFormField>

                <UFormField label="Job Title" name="title" required>
                    <UInput
                    v-model="experienceForm.title"
                    placeholder="e.g., Software Engineer, Product Manager"
                    size="lg"
                    :disabled="experienceLoading"
                    />
                </UFormField>
        
                <div class="grid grid-cols-2 gap-4">
                    <UFormField label="City" name="city">
                    <UInput
                        v-model="experienceForm.city"
                        placeholder="e.g., San Francisco"
                        size="lg"
                        :disabled="experienceLoading"
                    />
                    </UFormField>

                    <UFormField label="Country" name="country">
                    <UInput
                        v-model="experienceForm.country"
                        placeholder="e.g., USA"
                        size="lg"
                        :disabled="experienceLoading"
                    />
                    </UFormField>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <UFormField label="Start Month" name="start_month">
                    <USelectMenu
                        :items="months"
                        :model-value="experienceForm.start_month ?? undefined"
                        @update:model-value="(v: number | undefined) => experienceForm.start_month = v ?? null"
                        placeholder="Month"
                        size="lg"
                        class="w-full"
                        :disabled="experienceLoading"
                    />
                    </UFormField>

                    <UFormField label="Start Year" name="start_year">
                    <USelectMenu
                        :items="years"
                        :model-value="experienceForm.start_year ?? undefined"
                        @update:model-value="(v: number | undefined) => experienceForm.start_year = v ?? null"
                        placeholder="Year"
                        size="lg"
                        class="w-full"
                        :disabled="experienceLoading"
                    />
                    </UFormField>
                </div>

                <UFormField label="Currently working here" name="is_current">
                    <UCheckbox
                    :model-value="!!experienceForm.is_current"
                    @update:model-value="(v: boolean | 'indeterminate') => {
                        experienceForm.is_current = v === true
                        if (v === true) {
                        experienceForm.end_month = null
                        experienceForm.end_year = null
                        }
                    }"
                    :disabled="experienceLoading"
                    />
                </UFormField>

                <div v-if="!experienceForm.is_current" class="grid grid-cols-2 gap-4">
                    <UFormField label="End Month" name="end_month">
                    <USelectMenu
                        :items="months"
                        :model-value="experienceForm.end_month ?? undefined"
                        @update:model-value="(v: number | undefined) => experienceForm.end_month = v ?? null"
                        placeholder="Month"
                        size="lg"
                        class="w-full"
                        :disabled="experienceLoading"
                    />
                    </UFormField>

                    <UFormField label="End Year" name="end_year">
                    <USelectMenu
                        :items="years"
                        :model-value="experienceForm.end_year ?? undefined"
                        @update:model-value="(v: number | undefined) => experienceForm.end_year = v ?? null"
                        placeholder="Year"
                        size="lg"
                        class="w-full"
                        :disabled="experienceLoading"
                    />
                    </UFormField>
                </div>

                <UFormField label="Description" name="description">
                    <UTextarea
                    v-model="experienceForm.description"
                    placeholder="Describe your responsibilities and achievements..."
                    :rows="4"
                    size="lg"
                    :disabled="experienceLoading"
                    />
                </UFormField>
                </form>
            </template>
            <template #footer>
                <div class="w-full flex justify-end gap-3">
                <UButton
                    :label="editingExperienceId ? 'Update' : 'Add'"
                    @click="saveExperience"
                    :loading="experienceLoading"
                />
                </div>
            </template>
        </UModal>

        <!-- Delete Experience Confirmation Modal -->
        <UModal v-model:open="showDeleteExperienceModal" title="Delete Experience" description="This action cannot be undone" color="error">
            <template #body>
                <div class="space-y-4">
                <p class="text-gray-700 dark:text-gray-300">
                    Are you sure you want to delete this experience? This will permanently remove it from your profile.
                </p>
                </div>
            </template>
            <template #footer>
                <div class="w-full flex justify-end gap-3">
                <UButton
                    label="Cancel"
                    color="neutral"
                    variant="ghost"
                    @click="showDeleteExperienceModal = false"
                    :disabled="experienceLoading"
                />
                <UButton
                    label="Delete"
                    color="error"
                    @click="deleteExperience"
                    :loading="experienceLoading"
                />
                </div>
            </template>
        </UModal>
    </div>
</template>