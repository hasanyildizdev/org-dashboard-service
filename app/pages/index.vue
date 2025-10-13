<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
definePageMeta({
  layout: 'dashboard',
  // colorMode: 'dark'
})

const items: NavigationMenuItem[][] = [
  [
    {
      label: 'General',
      icon: 'i-lucide-user',
      active: true
    },
    {
      label: 'Members',
      icon: 'i-lucide-users'
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
      to: 'https://ui.nuxt.com/docs',
      target: '_blank'
    },
    {
      label: 'Help & Feedback',
      icon: 'i-lucide-help-circle',
      to: 'https://github.com/nuxt/ui/issues',
      target: '_blank'
    }
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
    <UDashboardToolbar>
      <UNavigationMenu :items="items" highlight class="flex-1" />
    </UDashboardToolbar>
    <UContainer class="p-6">
      <p class="text-2xl text-primary">Hello World</p>
    </UContainer>
  </UDashboardPanel>
</template>

