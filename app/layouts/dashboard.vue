<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import type { TabsItem } from '@nuxt/ui'
const items: NavigationMenuItem[][] = [[{
  label: 'Home',
  icon: 'i-lucide-house',
  active: true
}, {
  label: 'Inbox',
  icon: 'i-lucide-inbox',
  badge: '4'
}, {
  label: 'Contacts',
  icon: 'i-lucide-users'
}, {
  label: 'Settings',
  icon: 'i-lucide-settings',
  defaultOpen: true,
  children: [{
    label: 'General'
  }, {
    label: 'Members'
  }, {
    label: 'Notifications'
  }]
}], [{
  label: 'Feedback',
  icon: 'i-lucide-message-circle',
  to: '/',
  target: '_blank'
}, {
  label: 'Help & Support',
  icon: 'i-lucide-info',
  to: '/',
  target: '_blank'
}]]
const tabs_items: TabsItem[] = [
  {
    label: 'All',
    value: 'all'
  },
  {
    label: 'Unread',
    value: 'unread'
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
        <UButton
            :label="collapsed ? undefined : 'Search...'"
            icon="i-lucide-search"
            color="neutral"
            variant="outline"
            block
            :square="collapsed"
        >
            <template v-if="!collapsed" #trailing>
            <div class="flex items-center gap-0.5 ms-auto">
                <UKbd value="meta" variant="subtle" />
                <UKbd value="K" variant="subtle" />
            </div>
            </template>
        </UButton>

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
    <UDashboardPanel>
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
                <UTabs :items="tabs_items" default-value="all" size="sm" class="w-40" :content="false" />
            </template>
        </UDashboardNavbar>
        <UDashboardSearch />
        <slot />
      </template>
    </UDashboardPanel>
    <!-- <UDashboardSidebar resizable>
      <template #resize-handle="{ onMouseDown, onTouchStart, onDoubleClick }">
        <UDashboardResizeHandle
          class="after:absolute after:inset-y-0 after:right-0 after:w-px hover:after:bg-(--ui-border-accented) after:transition"
          @mousedown="onMouseDown"
          @touchstart="onTouchStart"
          @dblclick="onDoubleClick"
        />
      </template>
        <UDashboardSearchButton />
    </UDashboardSidebar> -->
  </UDashboardGroup>
</template>
