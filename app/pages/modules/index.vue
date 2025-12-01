<script setup lang="ts">
import { useUserModuleStore } from '~/stores/user_module'
import type { UserModule } from '~/types/core_types'

definePageMeta({
  title: 'Modules',
})

const toast = useToast()
const userModuleStore = useUserModuleStore()

interface ModuleInfo {
  id: string
  name: string
  label: string
  price: 'Free' | 'Paid'
  icon: string
  title: string
  desc: string[]
}

const availableModules = ref<ModuleInfo[]>([
  { 
    id: '1',
    name: 'PMS', 
    label: 'PMS', 
    price: 'Free', 
    icon: 'mdi:compass-outline', 
    title: 'Project Management System',
    desc: [
      'Task & project tracking',
      'Kanban board',
      'Deadlines & reminders',
      'Team collaboration tools'
    ] 
  },
  { 
    id: '2',
    name: 'IMS', 
    label: 'IMS', 
    price: 'Paid', 
    icon: 'mdi:warehouse', 
    title: 'Inventory Management System',
    desc: [
      'Stock tracking',
      'Barcode scanning',
      'Purchase & supplier management',
      'Warehouse optimization'
    ] 
  },
  { 
    id: '3',
    name: 'CRM', 
    label: 'CRM', 
    price: 'Paid', 
    icon: 'mdi:handshake', 
    title: 'Customer Relationship Management',
    desc: [
      'Lead management',
      'Customer follow-up',
      'Sales pipeline',
      'Email automation'
    ] 
  },
  { 
    id: '4',
    name: 'PLM', 
    label: 'PLM', 
    price: 'Paid', 
    icon: 'mdi:recycle', 
    title: 'Product Lifecycle Management',
    desc: [
      'Version control',
      'Manufacturing workflow',
      'Quality assurance monitoring'
    ] 
  },
  { 
    id: '5',
    name: 'ERP', 
    label: 'ERP', 
    price: 'Paid', 
    icon: 'mdi:clipboard-flow-outline', 
    title: 'Enterprise Resource Planning',
    desc: [
      'Financial management',
      'Inventory management',
      'Order management',
      'Warehouse management',
      'Supplier management'
    ] 
  }
])

// Load user modules on mount
onMounted(async () => {
  await userModuleStore.fetchUserModules()
  
  // Auto-enable PMS module (free) by default for new users
  const pmsModuleId = '1' // PMS module ID
  const hasPMS = userModuleStore.userModules.some(m => m.module_id === pmsModuleId)
  
  if (!hasPMS) {
    // Automatically create and enable PMS module for first-time users
    // Users can still disable it later if they want
    await userModuleStore.createUserModule({
      module_id: pmsModuleId,
      is_enabled: true
    })
  }
})

// Check if a module is enabled
function isModuleEnabled(moduleId: string): boolean {
  const userModule = userModuleStore.userModules.find(m => m.module_id === moduleId)
  return userModule?.is_enabled || false
}

// Get user module ID for a given module
function getUserModuleId(moduleId: string): string | null {
  const userModule = userModuleStore.userModules.find(m => m.module_id === moduleId)
  return userModule?.id || null
}

// Toggle module state
async function toggleModule(moduleId: string) {
  const userModuleId = getUserModuleId(moduleId)
  const isEnabled = isModuleEnabled(moduleId)
  
  let result
  if (userModuleId) {
    // Update existing
    result = await userModuleStore.toggleUserModule(userModuleId, moduleId, isEnabled)
  } else {
    // Create new
    result = await userModuleStore.createUserModule({
      module_id: moduleId,
      is_enabled: true
    })
  }
  
  if (result.success) {
    toast.add({
      title: 'Success',
      description: `Module ${isEnabled ? 'disabled' : 'enabled'} successfully`,
      color: 'success'
    })
  } else {
    toast.add({
      title: 'Error',
      description: result.error || 'Failed to update module',
      color: 'error'
    })
  }
}

// Computed property for active modules count
const activeModulesCount = computed(() => {
  return userModuleStore.userModules.filter(m => m.is_enabled).length
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
        <UDashboardNavbar title="Modules">
            <template #leading>
                <UDashboardSidebarCollapse variant="subtle" />
            </template>
            <template #trailing>
                <UBadge color="primary" variant="soft" size="sm">
                    {{ activeModulesCount }}/{{ availableModules.length }} Active
                </UBadge>
            </template>
        </UDashboardNavbar>
      </template>
      <template #body>
          <UContainer>
              <UCard>
                  <template #header>
                      <div class="flex items-center justify-between">
                          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Module Control</h3>
                      </div>
                  </template>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div
                          v-for="module in availableModules"
                          :key="module.id"
                          class="group relative">
                          <div 
                              class="p-4 rounded-xl border transition-all duration-200"
                              :class="[
                                  isModuleEnabled(module.id)
                                      ? 'border-(--ui-border-accented) shadow-sm' 
                                      : 'border-(--ui-border) opacity-75',
                              ]">
                            <div class="flex items-center gap-2">
                                <span class="text-gray-500 dark:text-gray-500">
                                    {{ isModuleEnabled(module.id) ? 'Active' : 'Inactive' }}
                                </span>
                                <USwitch 
                                    :model-value="isModuleEnabled(module.id)"
                                    :color="isModuleEnabled(module.id) ? 'success' : 'neutral'"
                                    @update:model-value="toggleModule(module.id)"
                                />
                            </div>
                              <div class="flex items-start gap-3 mt-6">
                                  <div class="flex-shrink-0">
                                      <UAvatar 
                                          :icon="module.icon" 
                                          size="lg"
                                          :class="isModuleEnabled(module.id) ? 'ring-2 ring-(--ui-primary)' : ''"
                                      />
                                  </div>
                                  <div class="flex-1 min-w-0">
                                      <div class="flex items-center gap-2 mb-1">
                                          <h4 class="font-semibold text-gray-900 dark:text-white truncate">{{ module.label }}</h4>
                                          <UBadge
                                              :color="module.price === 'Paid' ? 'primary' : 'success'"
                                              :variant="isModuleEnabled(module.id) ? 'solid' : 'soft'"
                                              :icon="module.price === 'Paid' ? 'mdi:lock' : 'mdi:gift-outline'"
                                              :label="module.price"
                                              trailing
                                              :ui="{ label: 'text-base'}"
                                          />
                                      </div>
                                      <h5 class="mt-4 font-semibold text-gray-900 dark:text-white truncate">{{ module.title }}</h5>
                                      <ul class="pb-3.5 text-muted list-disc pl-6 mt-2">
                                          <li v-for="(line, index) in module.desc" :key="index">
                                              {{ line }}
                                          </li>
                                      </ul>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </UCard>
          </UContainer>
      </template>
  </UDashboardPanel>
</template>
