<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'
definePageMeta({
  title: 'Modules',
})

interface Module {
  name: string
  label: string
  active: boolean
  price: 'Free' | 'Paid'
  icon: string
  desc: string
}

const modules = ref<Module[]>([
  { name: 'Socialize', label: 'Socialize', active: true, price: 'Free', icon: 'mdi:account-group', desc: 'Socialize is a social media platform for professionals.' },
  { name: 'PMS', label: 'PMS', active: true, price: 'Free', icon: 'mdi:compass-outline', desc: 'Project Management System' },
  { name: 'CRM', label: 'CRM', active: false, price: 'Paid', icon: 'mdi:handshake', desc: 'Customer Relationship Management' },
  { name: 'PLM', label: 'PLM', active: false, price: 'Paid', icon: 'mdi:recycle', desc: 'Product Lifecycle Management' },
  { name: 'IMS', label: 'IMS', active: false, price: 'Paid', icon: 'mdi:warehouse', desc: 'Inventory Management System' },
  { name: 'ERP', label: 'ERP', active: false, price: 'Paid', icon: 'mdi:clipboard-flow-outline', desc: 'Enterprise Resource Planning' }
])
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
                    {{ modules.filter(m => m.active).length }}/{{ modules.length }} Active
                </UBadge>
            </template>
        </UDashboardNavbar>
      </template>
      <template #body>
          <UContainer>

              <!-- Module Control Panel -->
              <UCard>
                  <template #header>
                      <div class="flex items-center justify-between">
                          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Module Control</h3>
                      </div>
                  </template>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div
                          v-for="(module, index) in modules"
                          :key="module.name"
                          class="group relative"
                      >
                          <div 
                              class="p-4 rounded-xl border transition-all duration-200"
                              :class="[
                                  module.active 
                                      ? 'border-(--ui-border-accented) shadow-sm' 
                                      : 'border-(--ui-border) opacity-75',
                              ]"
                          >
                              <div class="flex items-start gap-3">
                                  <div class="flex-shrink-0">
                                      <UAvatar 
                                          :icon="module.icon" 
                                          size="lg"
                                          :class="module.active ? 'ring-2 ring-(--ui-primary)' : ''"
                                      />
                                  </div>
                                  
                                  <div class="flex-1 min-w-0">
                                      <div class="flex items-center gap-2 mb-1">
                                          <h4 class="font-semibold text-gray-900 dark:text-white truncate">{{ module.label }}</h4>
                                          <UBadge
                                              :color="module.price === 'Paid' ? 'primary' : 'success'"
                                              :variant="module.active ? 'solid' : 'soft'"
                                              :icon="module.price === 'Paid' ? 'mdi:lock' : 'mdi:gift-outline'"
                                              :label="module.price"
                                              trailing
                                          />
                                      </div>
                                      
                                      <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                                          {{ module.desc }}
                                      </p>
                                      
                                      <div class="flex items-center gap-2">
                                          <span class="text-gray-500 dark:text-gray-500">
                                              {{ module.active ? 'Active' : 'Inactive' }}
                                          </span>
                                          <USwitch 
                                              v-model="module.active"
                                              :color="module.active ? 'success' : 'neutral'"
                                          />
                                      </div>
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
