<script setup lang="ts">
import type { NavigationMenuItem, CommandPaletteGroup, CommandPaletteItem } from '@nuxt/ui'
const items: NavigationMenuItem[][] = [[
{
  label: 'Home',
  icon: 'i-lucide-house',
  to: '/'
}, 
{
  label: 'Bio',
  icon: 'mdi:badge-account-horizontal-outline',
  to: '/bio'
}, 
{
  label: 'Map',
  icon: 'mdi:earth',
  to: '/map'
}, 
{
  label: 'Contacts',
  icon: 'i-lucide-users'
}, 
{
  label: 'Chat',
  icon: 'i-lucide-message-circle',
  badge: '4',
  to: '/chat'
}, 
{
  label: 'Modules',
  icon: 'mdi:package-variant-closed-plus',
  defaultOpen: true,
  children: 
  [
    {
      label: 'PMS',
      icon: 'mdi:compass-outline',
      to: '/pms'
    }, 
    {
      label: 'ERD',
      icon: 'mdi:drawing-box',
      to: '/erd'
    }, 
    {
      label: 'CRM',
      icon: 'mdi:handshake',
      to: '/crm'
    }, 
    {
      label: 'PLM',
      icon: 'mdi:recycle',
      to: '/plm'
    }, 
    {
      label: 'IMS',
      icon: 'mdi:warehouse',
      to: '/ims'
    }, 
    {
      label: 'ERP',
      icon: 'mdi:clipboard-flow-outline',
      to: '/erp'
    }, 
  ]
},
{
  label: 'Settings',
  icon: 'i-lucide-settings',
  defaultOpen: false,
  children: 
  [
    {
      label: 'General',
      to: '/settings/general'
    },
    {
      label: 'Members'
    },
    {
      label: 'Notifications'
    }
  ]
}],
[{
  label: 'Feedback',
  icon: 'i-lucide-message-circle',
  to: '/',
  target: '_blank'
}, {
  label: 'Help & Support',
  icon: 'i-lucide-info',
  to: '/',
  target: '_blank'
}]
]
const groups: CommandPaletteGroup<CommandPaletteItem>[] = [
  {
    id: 'main-navigation',
    // Optional: Add title: 'Main Navigation' for grouped display in the palette
    items: items[0] as CommandPaletteItem[]
  },
  {
    id: 'quick-actions',
    // Optional: Add title: 'Quick Actions' for grouped display in the palette
    items: items[1] as CommandPaletteItem[]
  }
]
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar
        collapsible
        resizable
        :ui="{ footer: 'border-t border-default' }">
        <template #resize-handle="{ onMouseDown, onTouchStart, onDoubleClick }">
            <UDashboardResizeHandle
            class="after:absolute after:inset-y-0 after:right-0 after:w-px hover:after:bg-(--ui-border-accented) after:transition"
            @mousedown="onMouseDown"
            @touchstart="onTouchStart"
            @dblclick="onDoubleClick"
            />
        </template>

        <template #header="{ collapsed }">
            <AppLogo v-if="!collapsed" class="h-5 w-auto shrink-0" />
            <UIcon v-else name="ic:baseline-sailing" class="size-5 text-primary mx-auto" />
        </template>

        <template #default="{ collapsed }">
          <UDashboardSearchButton />

          <UNavigationMenu
              :collapsed="collapsed"
              :items="items[0]"
              orientation="vertical"
          />

          <UNavigationMenu
              :collapsed="collapsed"
              :items="items[1]"
              orientation="vertical"
              class="mt-auto"
          />
        </template>

        <template #footer="{ collapsed }">
        <UButton
            :avatar="{
            src: 'https://github.com/benjamincanac.png'
            }"
            :label="collapsed ? undefined : 'Benjamin'"
            color="neutral"
            variant="ghost"
            class="w-full"
            :block="collapsed"
        />
        </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="groups"/>
    
    <slot />
    
  </UDashboardGroup>
</template>
