<script setup lang="ts">
import { useUserEducationStore } from '~/stores/user_education'
import type { UserEducation, UserEducationInput } from '~/types/core_types'

const toast = useToast()

const months = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
const currentYear = new Date().getFullYear()
const years = Array.from({ length: 65 }, (_, i) => currentYear - 60 + i) // Generate year options (last 60 years to next 5 years)
const degreeTypes = ref(['High School', 'Associate', 'Bachelor', 'Master', 'Doctorate', 'Professional', 'Certificate', 'Diploma'])

// Education state
const educationStore = useUserEducationStore()
const showEducationModal = ref(false)
const editingEducationId = ref<string | null>(null)
const educationLoading = ref(false)
const showDeleteEducationModal = ref(false)
const deletingEducationId = ref<string | null>(null)

// Education form data
const educationForm = ref<UserEducationInput>({
  institution: '',
  degree: null,
  field_of_study: null,
  city: null,
  country: null,
  start_month: null,
  start_year: null,
  end_month: null,
  end_year: null,
  grade: null,
  is_current: false,
  description: null
})

// Education Functions
function openEducationModal() {
  resetEducationForm()
  editingEducationId.value = null
  showEducationModal.value = true
}

function editEducation(education: UserEducation) {
  editingEducationId.value = education.id
  educationForm.value = {
    institution: education.institution,
    degree: education.degree,
    field_of_study: education.field_of_study,
    city: education.city,
    country: education.country,
    start_month: education.start_month,
    start_year: education.start_year,
    end_month: education.end_month,
    end_year: education.end_year,
    grade: education.grade,
    is_current: education.is_current,
    description: education.description
  }
  showEducationModal.value = true
}

function resetEducationForm() {
  educationForm.value = {
    institution: '',
    degree: null,
    field_of_study: null,
    city: null,
    country: null,
    start_month: null,
    start_year: null,
    end_month: null,
    end_year: null,
    grade: null,
    is_current: false,
    description: null
  }
}

async function saveEducation() {
  if (!educationForm.value.institution) {
    toast.add({
      title: 'Error',
      description: 'Institution name is required',
      color: 'error'
    })
    return
  }

  educationLoading.value = true

  try {
    let result
    if (editingEducationId.value) {
      result = await educationStore.updateUserEducation(editingEducationId.value, educationForm.value)
    } else {
      result = await educationStore.createUserEducation(educationForm.value)
    }

    if (result.success) {
      toast.add({
        title: 'Success',
        description: editingEducationId.value ? 'Education updated successfully' : 'Education added successfully',
        color: 'success'
      })
      showEducationModal.value = false
      resetEducationForm()
    } else {
      toast.add({
        title: 'Error',
        description: result.error || 'Failed to save education',
        color: 'error'
      })
    }
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.message || 'Failed to save education',
      color: 'error'
    })
  } finally {
    educationLoading.value = false
  }
}

function confirmDeleteEducation(id: string) {
  deletingEducationId.value = id
  showDeleteEducationModal.value = true
}


async function deleteEducation() {
  if (!deletingEducationId.value) return

  educationLoading.value = true

  try {
    const result = await educationStore.deleteUserEducation(deletingEducationId.value)

    if (result.success) {
      toast.add({
        title: 'Success',
        description: 'Education deleted successfully',
        color: 'success'
      })
      showDeleteEducationModal.value = false
      deletingEducationId.value = null
    } else {
      toast.add({
        title: 'Error',
        description: result.error || 'Failed to delete education',
        color: 'error'
      })
    }
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.message || 'Failed to delete education',
      color: 'error'
    })
  } finally {
    educationLoading.value = false
  }
}

onMounted(async () => {
  await educationStore.fetchUserEducations()
})
</script>

<template>
    <div>
        <!-- Education Section (client-only, no SSR) -->
        <ClientOnly>
            <UCard id="education">
                <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold">Education</h3>
                    <!-- Education Modal -->
                    <UButton
                    label="Add Education"
                    icon="i-lucide-plus"
                    trailing
                    @click="openEducationModal"
                    />
                </div>
                </template>

                <div v-if="educationStore.userEducations.length === 0">
                <UEmpty 
                    title="No education added yet" 
                    description="Add your education to your profile"
                    icon="i-lucide-graduation-cap"
                    size="lg"
                />
                </div>

                <div v-else class="space-y-4">
                <div
                    v-for="education in educationStore.userEducations"
                    :key="education.id"
                    class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                >
                    <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <div class="flex items-start gap-3">
                        <div class="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                            <UIcon name="i-lucide-graduation-cap" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div class="flex-1">
                            <div class="flex items-start justify-between gap-2">
                            <div>
                                <h4 class="font-semibold text-base">{{ education.institution }}</h4>
                                <p v-if="education.degree || education.field_of_study" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                <span v-if="education.degree">{{ education.degree }}</span>
                                <span v-if="education.degree && education.field_of_study"> in </span>
                                <span v-if="education.field_of_study">{{ education.field_of_study }}</span>
                                </p>
                            </div>
                            <UBadge v-if="education.is_current" color="primary" variant="soft" size="xs">
                                Current
                            </UBadge>
                            </div>
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
                            <p v-if="education.description" class="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                            {{ education.description }}
                            </p>
                        </div>
                        </div>
                    </div>
                    <div class="flex gap-2 ml-4">
                        <UButton
                        icon="i-lucide-pencil"
                        size="sm"
                        color="neutral"
                        variant="ghost"
                        square
                        @click="editEducation(education)"
                        />
                        <UButton
                            icon="i-lucide-trash-2"
                            size="sm"
                            color="error"
                            variant="ghost"
                            square
                            @click="confirmDeleteEducation(education.id)"
                        />
                    </div>
                    </div>
                </div>
                </div>
            </UCard>
        </ClientOnly>

        <!-- Delete Education Confirmation Modal -->
        <UModal v-model:open="showDeleteEducationModal" title="Delete Education" description="This action cannot be undone" color="error">
            <template #body>
            <div class="space-y-4">
                <p class="text-gray-700 dark:text-gray-300">
                Are you sure you want to delete this education? This will permanently remove it from your profile.
                </p>
            </div>
            </template>
            <template #footer>
            <div class="w-full flex justify-end gap-3">
                <UButton
                label="Delete"
                color="error"
                @click="deleteEducation"
                :loading="educationLoading"
                />
            </div>
            </template>
        </UModal>

        <!-- Education Modal -->
        <UModal v-model:open="showEducationModal" :title="editingEducationId ? 'Edit Education' : 'Add Education'">
            <template #body>
                <form @submit.prevent="saveEducation" class="space-y-4">
                <UFormField label="Institution *" name="institution" required>
                    <UInput
                    v-model="educationForm.institution"
                    placeholder="e.g., MIT, Stanford University"
                    size="lg"
                    :disabled="educationLoading"
                    />
                </UFormField>
        
                <div class="grid grid-cols-2 gap-4">
                    <UFormField label="Degree" name="degree">
                    <USelectMenu
                        :items="degreeTypes"
                        :model-value="educationForm.degree ?? undefined"
                        @update:model-value="(v: string | undefined) => educationForm.degree = v ?? null"
                        placeholder="Degree"
                        size="lg"
                        class="w-48" 
                        :disabled="educationLoading"
                    />
                    </UFormField>
                    <UFormField label="Field of Study" name="field_of_study">
                    <UInput
                        v-model="educationForm.field_of_study"
                        placeholder="e.g., Computer Science"
                        size="lg"
                        :disabled="educationLoading"
                    />
                    </UFormField>
                </div>
        
                <div class="grid grid-cols-2 gap-4">
                    <UFormField label="City" name="city">
                    <UInput
                        v-model="educationForm.city"
                        placeholder="e.g., Cambridge"
                        size="lg"
                        :disabled="educationLoading"
                    />
                    </UFormField>
                    <UFormField label="Country" name="country">
                    <UInput
                        v-model="educationForm.country"
                        placeholder="e.g., United States"
                        size="lg"
                        :disabled="educationLoading"
                    />
                    </UFormField>
                </div>
        
                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                    <label class="text-sm font-medium">Start Date</label>
                    <div class="grid grid-cols-2 gap-2">
                        <USelectMenu
                        :items="months"
                        :model-value="educationForm.start_month ?? undefined"
                        @update:model-value="(v: number | undefined) => educationForm.start_month = v ?? null"
                        placeholder="Month"
                        size="lg"
                        :disabled="educationLoading"
                        />
                        <USelectMenu
                        :items="years"
                        :model-value="educationForm.start_year ?? undefined"
                        @update:model-value="(v: number | undefined) => educationForm.start_year = v ?? null"
                        placeholder="Year"
                        size="lg"
                        :disabled="educationLoading"
                        />
                    </div>
                    </div>
        
                    <div class="space-y-2">
                    <label class="text-sm font-medium">End Date</label>
                    <div class="grid grid-cols-2 gap-2">
                        <USelectMenu
                        :items="months"
                        :model-value="educationForm.end_month ?? undefined"
                        @update:model-value="(v: number | undefined) => educationForm.end_month = v ?? null"
                        placeholder="Month"
                        size="lg"
                        :disabled="educationLoading || !!educationForm.is_current"
                        />
                        <USelectMenu
                        :items="years"
                        :model-value="educationForm.end_year ?? undefined"
                        @update:model-value="(v: number | undefined) => educationForm.end_year = v ?? null"
                        placeholder="Year"
                        size="lg"
                        :disabled="educationLoading || !!educationForm.is_current"
                        />
                    </div>
                    </div>
                </div>
        
                <UFormField>
                    <UCheckbox
                    :model-value="!!educationForm.is_current"
                    @update:model-value="(v: boolean | 'indeterminate') => educationForm.is_current = v === true"
                    label="I currently study here"
                    :disabled="educationLoading"
                    />
                </UFormField>
        
                <UFormField label="Grade/GPA" name="grade">
                    <UInput
                    v-model="educationForm.grade"
                    placeholder="e.g., 3.8/4.0, First Class Honours"
                    size="lg"
                    :disabled="educationLoading"
                    />
                </UFormField>
        
                <UFormField label="Description" name="description">
                    <UTextarea
                    v-model="educationForm.description"
                    placeholder="Describe your studies, achievements, etc."
                    :rows="4"
                    size="lg"
                    :disabled="educationLoading"
                    />
                </UFormField>
                </form>
            </template>
            <template #footer>
                <div class="w-full flex justify-end gap-3">
                <UButton
                    :label="editingEducationId ? 'Update' : 'Add'"
                    @click="saveEducation"
                    :loading="educationLoading"
                />
                </div>
            </template>
        </UModal>
    </div>
</template>