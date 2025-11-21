<script setup lang="ts">
import type { NavigationMenuItem, CommandPaletteGroup, CommandPaletteItem } from '@nuxt/ui'
import { useAuthStore } from '~/stores/auth'
const route = useRoute()
const user = computed(() => useAuthStore().user)
type MetaContent = string | string[]
useHead({
    title: (): string => (route.meta?.title as string) ?? 'Ourganize',
    titleTemplate: (titleChunk) => {
        return titleChunk ? `${titleChunk} - Ourganize` : 'Ourganize';
    },
    htmlAttrs: {
        lang: 'en',
        dir: 'ltr',
    },
    link: [
        {
            rel: 'icon',
            type: 'icon',
            href: '/favicon.ico',
        },
    ],
    meta: [
        {
            name: 'description',
            content: route.meta?.description ? [route.meta.description] as MetaContent : ['Streamline your workflows, connect scattered systems, and automate routine tasks with AI so your teams can focus on what truly matters.'] as MetaContent,
        },
        {
            property: 'og:site_name',
            content: `Ourganize - ${route.meta?.title}`
        },
        {
            property: 'og:description',
            content: route.meta?.description ? [route.meta.description] as MetaContent : ['Streamline your workflows, connect scattered systems, and automate routine tasks with AI so your teams can focus on what truly matters.'] as MetaContent,
        },
        {
            property: 'og:type',
            content: 'website',
        },
        {
            property: 'og:image',
            content: '/logo.png',
        },
    ],
})

const items: NavigationMenuItem[][] = [[
{
  label: 'Home',
  icon: 'i-lucide-house',
  to: '/'
},
{
  label: 'Organize',
  icon: 'mdi:ship-wheel',
  children: 
  [
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
      label: 'Modules',
      icon: 'mdi:package-variant-closed-plus',
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
          to: '/modules/crm',
          badge: 'Paid🔒'
        }, 
        {
          label: 'PLM',
          icon: 'mdi:recycle',
          to: '/modules/plm',
          badge: 'Paid 🔒'
        }, 
        {
          label: 'IMS',
          icon: 'mdi:warehouse',
          to: '/modules/ims',
          badge: 'Paid 🔒'
        }, 
        {
          label: 'ERP',
          icon: 'mdi:clipboard-flow-outline',
          to: '/modules/erp',
          badge: 'Paid 🔒'
        }, 
      ]
    }
  ]
},
{
  label: 'Map',
  icon: 'mdi:earth',
  children:
  [
    {
      label: 'Map',
      to: '/map',
      icon: 'mdi:map'
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
    }
  ]
}], 
[
  {
    label: 'Help & Support',
    icon: 'i-lucide-help-circle',
    to: '/help',
  },
  {
    label: 'Settings',
    icon: 'i-lucide-settings',
    to: '/settings',
  },
]
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
        resizable
        collapsible
        :max-size="16"
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
            <Logo v-else class="h-8 h-8 fill-primary dark:fill-white"/>
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
          <UUser
             to="/profile"
             :name="collapsed ? undefined : user?.name"
             :description="collapsed ? undefined : user?.profession?.name || 'User'"
             :avatar="{
               src: user?.avatar ?? ''
             }"
             :class="[
               'px-2 py-1 rounded-md w-full hover:cursor-pointer',
               route.path === '/profile' ? 'text-primary bg-primary/10' : ''
             ]"
             :block="collapsed"
           />
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
