<script setup lang="ts">
import type { NavigationMenuItem, CommandPaletteGroup, CommandPaletteItem } from '@nuxt/ui'
const items: NavigationMenuItem[][] = [[
{
  label: 'Home',
  icon: 'i-lucide-house',
  to: '/'
}, 
{
  label: 'Organa',
  icon: 'mdi:robot',
  to: '/organa',
  children: 
  [
    {
      label: 'AI Mentor',
      to: '/organa'
    },
    {
      label: 'Chat',
      to: '/organa/chat'
    }, 
  ]
}, 
{
  label: 'Bio',
  icon: 'mdi:badge-account-horizontal-outline',
  to: '/bio',
  children: [
    {
      label: 'Profile',
      to: '/bio/profile',
      icon: 'mdi:account'
    },
    {
      label: 'Education',
      to: '/bio/education',
      icon: 'mdi:book-education'
    },
    {
      label: 'Experience',
      to: '/bio/experience',
      icon: 'mdi:briefcase'
    },
    {
      label: 'Skills',
      to: '/bio/skills',
      icon: 'mdi:badge-account-horizontal-outline'
    },
    {
      label: 'Courses',
      to: '/bio/courses',
      icon: 'mdi:book-open'
    }
  ]
}, 
{
  label: 'Map',
  icon: 'mdi:earth',
  to: '/map'
}, 
{
  label: 'Contacts',
  icon: 'i-lucide-users',
  to: '/contacts',
  children: 
  [
    {
      label: 'Contact List',
      to: '/contacts',
      icon: 'mdi:account-group',
    },
    {
      label: 'Chat',
      badge: '4',
      to: '/contacts/chat',
      icon: 'i-lucide-message-circle',
    }, 
  ]
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
      to: '/modules/pms'
    }, 
    {
      label: 'ERD',
      icon: 'mdi:drawing-box',
      to: '/modules/erd'
    }, 
    {
      label: 'CRM',
      icon: 'mdi:handshake',
      to: '/modules/crm'
    }, 
    {
      label: 'PLM',
      icon: 'mdi:recycle',
      to: '/modules/plm'
    }, 
    {
      label: 'IMS',
      icon: 'mdi:warehouse',
      to: '/modules/ims'
    }, 
    {
      label: 'ERP',
      icon: 'mdi:clipboard-flow-outline',
      to: '/modules/erp'
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
    items: items[0] as CommandPaletteItem[]
  },
  {
    id: 'quick-actions',
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
          <UDashboardSearchButton v-if="!collapsed"/>

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
        <ULink to="/bio/profile">
        <UButton
            :avatar="{
            src: 'https://github.com/benjamincanac.png'
            }"
            :label="collapsed ? undefined : 'Hasan Yıldız'"
            color="neutral"
            variant="ghost"
            class="w-full"
            :block="collapsed"
        />
        </ULink>
        </template>
    </UDashboardSidebar>

    <UDashboardSearch 
      :groups="groups"
      :fuse="{ 
        fuseOptions: { 
          keys: ['label', 'children.label'],
          threshold: 0.4
        },
        resultLimit: 42
      }"/>

    <slot />
    
  </UDashboardGroup>
</template>
