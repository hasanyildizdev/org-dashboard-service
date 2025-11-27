<script setup lang="ts">
import type { SelectMenuItem } from '@nuxt/ui'
import { useAuthStore } from '~/stores/auth'
import { useProfileStore } from '~/stores/profile'
import { useUserEducationStore } from '~/stores/user_education'
import { useUserExperienceStore } from '~/stores/user_experience'
import { useUserSkillStore } from '~/stores/user_skill'
import { useSkillLevelsIcons } from '~/composables/skillLevelsIcons'
import type { UserEducation, UserEducationInput, UserExperience, UserExperienceInput, UserSkill, UserSkillInput } from '~/types/core_types'

definePageMeta({
  title: 'Edit Profile',
})

const router = useRouter()
const toast = useToast()
const loading = ref(false)
const deleteLoading = ref(false)
const showDeleteModal = ref(false)

const user = computed(() => useAuthStore().user)

// Education state
const educationStore = useUserEducationStore()
const showEducationModal = ref(false)
const editingEducationId = ref<string | null>(null)
const educationLoading = ref(false)
const showDeleteEducationModal = ref(false)
const deletingEducationId = ref<string | null>(null)

// Experience state
const experienceStore = useUserExperienceStore()
const showExperienceModal = ref(false)
const editingExperienceId = ref<string | null>(null)
const experienceLoading = ref(false)
const showDeleteExperienceModal = ref(false)
const deletingExperienceId = ref<string | null>(null)

// Skill state
const skillStore = useUserSkillStore()
const showSkillModal = ref(false)
const editingSkillId = ref<string | null>(null)
const skillLoading = ref(false)
const showDeleteSkillModal = ref(false)
const deletingSkillId = ref<string | null>(null)

const months = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
const currentYear = new Date().getFullYear()
const years = Array.from({ length: 65 }, (_, i) => currentYear - 60 + i) // Generate year options (last 60 years to next 5 years)
const degreeTypes = ref(['High School', 'Associate', 'Bachelor', 'Master', 'Doctorate', 'Professional', 'Certificate', 'Diploma'])

const { skillLevelsIcons } = useSkillLevelsIcons()
const skillLevels = ref([
  { 
    id: 'beginner',
    label: 'Beginner',
    icon: skillLevelsIcons.value['beginner'].icon, 
    color: skillLevelsIcons.value['beginner'].color
  },
  { 
    id: 'intermediate',
    label: 'Intermediate', 
    icon: skillLevelsIcons.value['intermediate'].icon, 
    color: skillLevelsIcons.value['intermediate'].color
  },
  { 
    id: 'advanced',
    label: 'Advanced', 
    icon: skillLevelsIcons.value['advanced'].icon, 
    color: skillLevelsIcons.value['advanced'].color
  },
  { 
    id: 'expert',
    label: 'Expert', 
    icon: skillLevelsIcons.value['expert'].icon, 
    color: skillLevelsIcons.value['expert'].color
  }
] satisfies SelectMenuItem[])

// Skill form data
const skillForm = ref<UserSkillInput>({
  name: '',
  level: skillLevels.value[0]?.id || 'beginner',
  is_primary: false
})

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

// Professions state
const profileStore = useProfileStore()
await profileStore.fetchProfessions()

// Load educations, experiences, and skills on mount (client-only)
onMounted(async () => {
  await educationStore.fetchUserEducations()
  await experienceStore.fetchUserExperiences()
  await skillStore.fetchUserSkills()
})

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

// Education Functions
function openEducationModal() {
  resetEducationForm()
  editingEducationId.value = null
  showEducationModal.value = true
}
// Experience Functions
function openExperienceModal() {
  resetExperienceForm()
  editingExperienceId.value = null
  showExperienceModal.value = true
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

function confirmDeleteEducation(id: string) {
  deletingEducationId.value = id
  showDeleteEducationModal.value = true
}
function confirmDeleteExperience(id: string) {
  deletingExperienceId.value = id
  showDeleteExperienceModal.value = true
}

async function confirmDeleteAccount() {
  showDeleteModal.value = true
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

// Skill functions
function openSkillModal() {
  editingSkillId.value = null
  skillForm.value = {
    name: '',
    level: skillLevels.value[0]?.id || 'beginner',
    is_primary: false
  }
  showSkillModal.value = true
}

function editSkill(skill: UserSkill) {
  editingSkillId.value = skill.id
  skillForm.value = {
    name: skill.name,
    level: skill.level,
    is_primary: skill.is_primary
  }
  showSkillModal.value = true
}

function resetSkillForm() {
  skillForm.value = {
    name: '',
    level: skillLevels.value[0]?.id || 'beginner',
    is_primary: false
  }
  editingSkillId.value = null
}

async function saveSkill() {
  if (!skillForm.value.name || !skillForm.value.level) {
    toast.add({
      title: 'Validation Error',
      description: 'Please fill in skill name and level',
      color: 'error'
    })
    return
  }
  
  skillLoading.value = true
  
  try {
    let result
    if (editingSkillId.value) {
      result = await skillStore.updateUserSkill(editingSkillId.value, skillForm.value)
    } else {
      result = await skillStore.createUserSkill(skillForm.value)
    }
    
    if (result.success) {
      toast.add({
        title: 'Success',
        description: editingSkillId.value ? 'Skill updated successfully!' : 'Skill added successfully!',
        color: 'success'
      })
      showSkillModal.value = false
      resetSkillForm()
    } else {
      toast.add({
        title: 'Error',
        description: result.error || 'Failed to save skill',
        color: 'error'
      })
    }
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.message || 'Failed to save skill',
      color: 'error'
    })
  } finally {
    skillLoading.value = false
  }
}

function confirmDeleteSkill(id: string) {
  deletingSkillId.value = id
  showDeleteSkillModal.value = true
}

async function deleteSkill() {
  if (!deletingSkillId.value) return
  
  skillLoading.value = true
  
  try {
    const result = await skillStore.deleteUserSkill(deletingSkillId.value)
    
    if (result.success) {
      toast.add({
        title: 'Success',
        description: 'Skill deleted successfully!',
        color: 'success'
      })
      showDeleteSkillModal.value = false
      deletingSkillId.value = null
    } else {
      toast.add({
        title: 'Error',
        description: result.error || 'Failed to delete skill',
        color: 'error'
      })
    }
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.message || 'Failed to delete skill',
      color: 'error'
    })
  } finally {
    skillLoading.value = false
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

                  <div v-if="educationStore.userEducations.length === 0" class="text-center py-8">
                    <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <UIcon name="i-lucide-graduation-cap" class="w-8 h-8 text-gray-400" />
                    </div>
                    <p class="text-gray-500 dark:text-gray-400 mb-4">No education added yet</p>
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
                  <div v-if="experienceStore.userExperiences.length === 0" class="text-center py-8 text-gray-500">
                    <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <UIcon name="i-lucide-briefcase" class="w-8 h-8 text-gray-400" />
                    </div>
                    <p class="text-gray-500 dark:text-gray-400 mb-4">No work experience added yet</p>
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

              <!-- User Skills Section -->
              <ClientOnly>
              <UCard>
                <template #header>
                  <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold">Skills</h3>
                    <UButton
                      icon="i-lucide-plus"
                      label="Add Skill"
                      @click="openSkillModal"
                    />
                  </div>
                </template>
                
                <div v-if="skillStore.userSkills.length === 0" class="text-center py-8 text-gray-500">
                  <UIcon name="i-lucide-code" class="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>No skills added yet</p>
                </div>
                
                <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

                    <!-- Actions -->
                    <template #footer>
                      <div class="flex justify-between">
                        <UButton
                          icon="i-lucide-trash"
                          size="lg"
                          color="error"
                          variant="soft"
                          @click="confirmDeleteSkill(skill.id)"
                        />
                        <UButton
                          icon="i-lucide-pencil"
                          size="lg"
                          variant="soft"
                          @click="editSkill(skill)"
                        />
                      </div>
                    </template>
                  </UCard>
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
                          placeholder="Month"
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

              <!-- Delete Skill Modal -->
              <UModal v-model:open="showDeleteSkillModal" title="Delete Skill" description="Are you sure you want to delete this skill?">
                <template #footer>
                  <div class="flex justify-end gap-2">
                    <UButton
                      label="Cancel"
                      variant="ghost"
                      @click="showDeleteSkillModal = false"
                    />
                    <UButton
                      label="Delete"
                      color="error"
                      :loading="skillLoading"
                      @click="deleteSkill"
                    />
                  </div>
                </template>
              </UModal>

              <!-- Add/Edit Skill Modal -->
              <UModal v-model:open="showSkillModal" :title="editingSkillId ? 'Edit Skill' : 'Add Skill'">
                <template #body>
                  <div class="space-y-4">
                    <UFormField label="Skill Name" required>
                      <UInput
                        v-model="skillForm.name"
                        placeholder="e.g., JavaScript, Design, Marketing"
                        icon="i-lucide-code"
                        size="lg"
                        class="w-full"
                      />
                    </UFormField>

                    <UFormField label="Skill Level" required>
                      <USelectMenu
                        v-model="skillForm.level"
                        :items="skillLevels"
                        value-key="id"
                        placeholder="Select level"
                        size="lg"
                        class="w-48"
                      />
                    </UFormField>

                    <UFormField label="Primary Skill">
                      <UCheckbox
                        v-model="skillForm.is_primary"
                        label="Mark as primary skill"
                        @update:model-value="(v: boolean | 'indeterminate') => { skillForm.is_primary = v === true }"
                      />
                    </UFormField>
                  </div>
                </template>
                <template #footer>
                  <div class="w-full flex justify-end gap-3">
                    <UButton
                      :label="editingSkillId ? 'Update' : 'Add'"
                      @click="saveSkill"
                      :loading="skillLoading"
                    />
                  </div>
                </template>
              </UModal>

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
          </UContainer>
      </template>
  </UDashboardPanel>
</template>
