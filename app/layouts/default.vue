<script setup lang="ts">
import type { NavigationMenuItem, CommandPaletteGroup, CommandPaletteItem } from '@nuxt/ui'
const route = useRoute()
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
  label: 'Bio',
  icon: 'mdi:badge-account-horizontal-outline',
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
}], [{
  label: 'Help & Support',
  icon: 'i-lucide-help-circle',
  to: '/help',
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
          <div class="w-full flex justify-between">
            <div>
              <ULink to="/bio/profile">
              <UButton
                  :avatar="{
                  src: 'https://github.com/benjamincanac.png'
                  }"
                  :label="collapsed ? undefined : 'Hasan Yıldız'"
                  color="neutral"
                  variant="ghost"
                  :block="collapsed"
              />
              </ULink>
            </div>
            <ULink v-if="!collapsed" to="/settings/general">
              <UButton
                  icon="i-lucide-settings"
                  color="neutral"
                  variant="ghost"
                  :block="collapsed"
              />
            </ULink>
          </div>
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
