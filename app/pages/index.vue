<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import type { TabsItem } from '@nuxt/ui'

definePageMeta({
  title: 'Dashboard',
  middleware: ['auth']
})

const items: NavigationMenuItem[][] = [
  [
    {
      label: 'Profile',
      icon: 'i-lucide-user',
      active: true
    },
    {
      label: 'Notifications',
      icon: 'i-lucide-bell'
    }
  ],
  [
    {
      label: 'Documentation',
      icon: 'i-lucide-book-open',
      to: 'https://ourganize.com/docs',
      target: '_blank'
    },
  ]
]
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
        <UDashboardNavbar title="Dashboard">
            <template #leading>
                <UDashboardSidebarCollapse variant="subtle" />
            </template>
            <template #trailing>
                <UBadge label="New" variant="subtle" />
            </template>
            <template #right>
                <UColorModeSwitch color="neutral"/>
            </template>
        </UDashboardNavbar>
      </template>
      <template #body>
          <UDashboardToolbar>
            <UNavigationMenu :items="items" highlight class="flex-1" />
          </UDashboardToolbar>
          <UContainer class="p-6">
            <p class="text-2xl text-primary">{{ $t('Welcome to Ourganize') }}</p>
          </UContainer>
      </template>
  </UDashboardPanel>
</template>

