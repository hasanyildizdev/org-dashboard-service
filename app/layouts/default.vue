<script setup lang="ts">
import type { NavigationMenuItem, CommandPaletteGroup, CommandPaletteItem } from '@nuxt/ui'
import { useAuthStore } from '~/stores/auth'
import { useUserModuleStore } from '~/stores/user_module'

const route = useRoute()
const user = computed(() => useAuthStore().user)
const userModuleStore = useUserModuleStore()

// Fetch user modules on layout mount
onMounted(async () => {
  await userModuleStore.fetchUserModules()
})
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

// Define all available module menu items with their module IDs
interface ModuleMenuItem extends NavigationMenuItem {
  moduleId?: string
}

const staticItems: ModuleMenuItem[] = [
  {
    label: 'Home',
    icon: 'mdi:ship-wheel',
    to: '/'
  },
  {
    label: 'Map',
    icon: 'mdi:earth',
    to: '/map'
  }
]

const moduleItems: ModuleMenuItem[] = [
  {
    label: 'PMS',
    icon: 'mdi:compass-outline',
    to: '/modules/pms',
    moduleId: '1' // PMS module ID
  },
  {
    label: 'IMS',
    icon: 'mdi:warehouse',
    to: '/modules/ims',
    moduleId: '2' // IMS module ID
  },
  {
    label: 'CRM',
    icon: 'mdi:handshake',
    to: '/modules/crm',
    moduleId: '3' // CRM module ID
  },
  {
    label: 'PLM',
    icon: 'mdi:recycle',
    to: '/modules/plm',
    moduleId: '4' // PLM module ID
  },
  {
    label: 'ERP',
    icon: 'mdi:clipboard-flow-outline',
    to: '/modules/erp',
    moduleId: '5' // ERP module ID
  }
]

// Filter module items based on enabled modules
const enabledModuleItems = computed(() => {
  return moduleItems.filter(item => {
    if (!item.moduleId) return true
    const userModule = userModuleStore.userModules.find(m => m.module_id === item.moduleId)
    return userModule?.is_enabled || false
  })
})

// Combine static items with enabled module items
const items = computed<NavigationMenuItem[][]>(() => [
  [...staticItems, ...enabledModuleItems.value],
  [
    {
      label: 'Modules',
      icon: 'mdi:package-variant-closed-plus',
      to: '/modules'
    }
  ]
])

const groups = computed<CommandPaletteGroup<CommandPaletteItem>[]>(() => [
  {
    id: 'main-navigation',
    items: items.value[0] as CommandPaletteItem[]
  },
  {
    id: 'quick-actions',
    items: items.value[1] as CommandPaletteItem[]
  }
])
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
             :name="user?.name"
             :description="collapsed ? undefined : user?.profession?.name || 'User'"
             :avatar="{src: user?.avatar ?? '' }"
             :class="[
               'px-2 py-1 rounded-md w-full hover:cursor-pointer',
               route.path === '/profile' ? 'text-primary bg-primary/10' : '',
               collapsed ? 'flex flex-col justify-center items-center gap-1 text-center text-sm leading-tight whitespace-normal break-words' : 'justify-start'
             ]">
            <template #name>
              <span :class="{ 'hidden': collapsed }">{{ user?.name }}</span>
            </template>
          </UUser>
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
