<script setup lang="ts">
import { useUserSkillStore } from '~/stores/user_skill'
import { useSkillLevelsIcons } from '~/composables/skillLevelsIcons'
import type { UserSkill, UserSkillInput } from '~/types/core_types'

const toast = useToast()

// Skill state
const skillStore = useUserSkillStore()
const showSkillModal = ref(false)
const editingSkillId = ref<string | null>(null)
const skillLoading = ref(false)
const showDeleteSkillModal = ref(false)
const deletingSkillId = ref<string | null>(null)
const { skillLevelsIcons } = useSkillLevelsIcons()

interface SkillLevelOption {
  id: string
  label: string
  icon: string
  color: string
}

const skillLevels = ref<SkillLevelOption[]>([
  { 
    id: 'beginner',
    label: 'Beginner',
    icon: skillLevelsIcons.value?.['beginner']?.icon || 'i-lucide-circle', 
    color: skillLevelsIcons.value?.['beginner']?.color || 'bg-gray-500'
  },
  { 
    id: 'intermediate',
    label: 'Intermediate', 
    icon: skillLevelsIcons.value?.['intermediate']?.icon || 'i-lucide-circle-dashed', 
    color: skillLevelsIcons.value?.['intermediate']?.color || 'bg-blue-500'
  },
  { 
    id: 'advanced',
    label: 'Advanced', 
    icon: skillLevelsIcons.value?.['advanced']?.icon || 'i-lucide-star', 
    color: skillLevelsIcons.value?.['advanced']?.color || 'bg-purple-500'
  },
  { 
    id: 'expert',
    label: 'Expert', 
    icon: skillLevelsIcons.value?.['expert']?.icon || 'i-lucide-crown', 
    color: skillLevelsIcons.value?.['expert']?.color || 'bg-yellow-500'
  }
])

// Skill form data
const skillForm = ref<UserSkillInput>({
  name: '',
  level: skillLevels.value[0]?.id || 'beginner',
  is_primary: false
})

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

onMounted(async () => {
  await skillStore.fetchUserSkills()
})
</script>
<template>
<div>
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
      
      <div v-if="skillStore.userSkills.length === 0">
         <UEmpty 
            title="No skills added yet" 
            description="Add your skills to your profile" 
            icon="i-lucide-code" 
            size="lg" 
          />
      </div>
      
      <div v-else class="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <UCard
          v-for="skill in skillStore.userSkills"
          :key="skill.id"
          class="transition hover:shadow-xl hover:-translate-y-1 duration-200"
          :ui="{body: 'p-0 sm:p-2'}"
>
          <!-- Skill Level -->
          <div class="flex items-center justify-center">
            <UBadge
              :class="skillLevelsIcons?.[skill.level as keyof typeof skillLevelsIcons]?.color || 'bg-gray-500'"
              :icon="skillLevelsIcons?.[skill.level as keyof typeof skillLevelsIcons]?.icon || 'i-lucide-circle'"
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
</div>
</template>