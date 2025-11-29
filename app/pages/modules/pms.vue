<script setup lang="ts">
import { useOrganizationStore } from '~/stores/organization'
import type { OrganizationInput } from '~/types/core_types'

definePageMeta({
  title: 'Project Management System',
})

const toast = useToast()
const organizationStore = useOrganizationStore()

// Modal states
const showOrganizationModal = ref(false)
const editingOrganizationId = ref<string | null>(null)
const showDeleteModal = ref(false)
const deletingOrganizationId = ref<string | null>(null)

// Form state
const organizationForm = ref<OrganizationInput>({
  name: '',
  slug: ''
})

// Load organizations on mount
onMounted(async () => {
  await organizationStore.fetchOrganizations()
})

// Organization functions
function openOrganizationModal() {
  editingOrganizationId.value = null
  organizationForm.value = {
    name: '',
    slug: ''
  }
  showOrganizationModal.value = true
}

function editOrganization(id: string) {
  const org = organizationStore.getOrganizationById(id)
  if (org) {
    editingOrganizationId.value = id
    organizationForm.value = {
      name: org.name,
      slug: org.slug
    }
    showOrganizationModal.value = true
  }
}

async function saveOrganization() {
  if (!organizationForm.value.name) {
    toast.add({
      title: 'Error',
      description: 'Organization name is required',
      color: 'error'
    })
    return
  }

  try {
    let result
    if (editingOrganizationId.value) {
      result = await organizationStore.updateOrganization(
        editingOrganizationId.value,
        organizationForm.value
      )
    } else {
      result = await organizationStore.createOrganization(organizationForm.value)
    }

    if (result.success) {
      toast.add({
        title: 'Success',
        description: editingOrganizationId.value
          ? 'Organization updated successfully'
          : 'Organization created successfully',
        color: 'success'
      })
      showOrganizationModal.value = false
      organizationForm.value = { name: '', slug: '' }
    } else {
      toast.add({
        title: 'Error',
        description: result.error || 'Failed to save organization',
        color: 'error'
      })
    }
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.message || 'Failed to save organization',
      color: 'error'
    })
  }
}

function confirmDelete(id: string) {
  deletingOrganizationId.value = id
  showDeleteModal.value = true
}

async function deleteOrganization() {
  if (!deletingOrganizationId.value) return

  try {
    const result = await organizationStore.deleteOrganization(deletingOrganizationId.value)
    
    if (result.success) {
      toast.add({
        title: 'Success',
        description: 'Organization deleted successfully',
        color: 'success'
      })
      showDeleteModal.value = false
      deletingOrganizationId.value = null
    } else {
      toast.add({
        title: 'Error',
        description: result.error || 'Failed to delete organization',
        color: 'error'
      })
    }
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.message || 'Failed to delete organization',
      color: 'error'
    })
  }
}

// Auto-generate slug from name
watch(() => organizationForm.value.name, (newName) => {
  if (!editingOrganizationId.value) {
    organizationForm.value.slug = newName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
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
      <UDashboardNavbar title="Project Management System">
        <template #leading>
          <UDashboardSidebarCollapse variant="subtle" />
        </template>
        <template #right>
          <UButton
            label="New Organization"
            icon="i-lucide-plus"
            @click="openOrganizationModal"
          />
        </template>
      </UDashboardNavbar>
    </template>
    
    <template #body>
      <UContainer class="p-6 space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold">Organizations</h1>
            <p class="text-gray-500 dark:text-gray-400 mt-1">
              Manage your organizations, workspaces, and projects
            </p>
          </div>
        </div>

        <!-- Organizations Grid -->
        <ClientOnly>
          <div v-if="organizationStore.loading && organizationStore.organizations.length === 0" class="text-center py-12">
            <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin mx-auto text-primary" />
            <p class="mt-4 text-gray-500">Loading organizations...</p>
          </div>

          <div v-else-if="organizationStore.organizations.length === 0" class="text-center py-12">
            <UIcon name="i-lucide-building-2" class="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600" />
            <h3 class="mt-4 text-lg font-semibold">No organizations yet</h3>
            <p class="mt-2 text-gray-500 dark:text-gray-400">
              Get started by creating your first organization
            </p>
            <UButton
              label="Create Organization"
              icon="i-lucide-plus"
              class="mt-6"
              @click="openOrganizationModal"
            />
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <UCard
              v-for="org in organizationStore.organizations"
              :key="org.id"
              class="hover:shadow-lg transition-shadow duration-200"
            >
              <template #header>
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold truncate">{{ org.name }}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <UIcon name="i-lucide-link" class="w-3 h-3 inline" />
                      {{ org.slug }}
                    </p>
                  </div>
                  <UIcon name="i-lucide-building-2" class="w-8 h-8 text-primary-500" />
                </div>
              </template>

              <div class="space-y-3">
                <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <UIcon name="i-lucide-users" class="w-4 h-4" />
                  <span>0 Workspaces</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <UIcon name="i-lucide-folder" class="w-4 h-4" />
                  <span>0 Projects</span>
                </div>
              </div>

              <template #footer>
                <div class="flex justify-between items-center">
                  <UButton
                    label="View"
                    variant="soft"
                    size="sm"
                    icon="i-lucide-eye"
                  />
                  <div class="flex gap-2">
                    <UButton
                      icon="i-lucide-pencil"
                      variant="ghost"
                      size="sm"
                      square
                      @click="editOrganization(org.id)"
                    />
                    <UButton
                      icon="i-lucide-trash-2"
                      variant="ghost"
                      color="error"
                      size="sm"
                      square
                      @click="confirmDelete(org.id)"
                    />
                  </div>
                </div>
              </template>
            </UCard>
          </div>
        </ClientOnly>

        <!-- Coming Soon Section -->
        <div class="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <UCard>
            <template #header>
              <div class="flex items-center gap-3">
                <UIcon name="i-lucide-layers" class="w-6 h-6 text-blue-500" />
                <h3 class="font-semibold">Workspaces</h3>
              </div>
            </template>
            <p class="text-gray-500 dark:text-gray-400">
              Organize your projects into workspaces within organizations.
            </p>
            <UBadge color="info" variant="soft" class="mt-4">Coming Soon</UBadge>
          </UCard>

          <UCard>
            <template #header>
              <div class="flex items-center gap-3">
                <UIcon name="i-lucide-folder-kanban" class="w-6 h-6 text-purple-500" />
                <h3 class="font-semibold">Projects</h3>
              </div>
            </template>
            <p class="text-gray-500 dark:text-gray-400">
              Manage projects with tasks, timelines, and team collaboration.
            </p>
            <UBadge color="primary" variant="soft" class="mt-4">Coming Soon</UBadge>
          </UCard>
        </div>
      </UContainer>
    </template>
  </UDashboardPanel>

  <!-- Organization Modal -->
  <UModal
    v-model:open="showOrganizationModal"
    :title="editingOrganizationId ? 'Edit Organization' : 'Create Organization'"
  >
    <template #body>
      <form @submit.prevent="saveOrganization" class="space-y-4">
        <UFormField label="Organization Name" name="name" required>
          <UInput
            v-model="organizationForm.name"
            placeholder="e.g., Acme Inc."
            size="lg"
            :disabled="organizationStore.loading"
          />
        </UFormField>

        <UFormField label="Slug" name="slug" required>
          <UInput
            v-model="organizationForm.slug"
            placeholder="e.g., acme-inc"
            size="lg"
            :disabled="organizationStore.loading"
          />
          <template #help>
            <span class="text-xs text-gray-500">
              Used in URLs. Auto-generated from name.
            </span>
          </template>
        </UFormField>
      </form>
    </template>
    
    <template #footer>
      <div class="flex justify-end gap-3">
        <UButton
          label="Cancel"
          variant="ghost"
          @click="showOrganizationModal = false"
          :disabled="organizationStore.loading"
        />
        <UButton
          :label="editingOrganizationId ? 'Update' : 'Create'"
          @click="saveOrganization"
          :loading="organizationStore.loading"
        />
      </div>
    </template>
  </UModal>

  <!-- Delete Confirmation Modal -->
  <UModal
    v-model:open="showDeleteModal"
    title="Delete Organization"
    description="This action cannot be undone"
    color="error"
  >
    <template #body>
      <p class="text-gray-700 dark:text-gray-300">
        Are you sure you want to delete this organization? All associated workspaces and projects will also be deleted.
      </p>
    </template>
    
    <template #footer>
      <div class="flex justify-end gap-3">
        <UButton
          label="Cancel"
          variant="ghost"
          @click="showDeleteModal = false"
          :disabled="organizationStore.loading"
        />
        <UButton
          label="Delete"
          color="error"
          @click="deleteOrganization"
          :loading="organizationStore.loading"
        />
      </div>
    </template>
  </UModal>
</template>
