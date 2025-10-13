<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
const items: NavigationMenuItem[][] = [[
{
  label: 'Home',
  icon: 'i-lucide-house',
  to: '/'
}, 
{
  label: 'Chat',
  icon: 'i-lucide-message-circle',
  badge: '4',
  to: '/chat'
}, 
{
  label: 'Inbox',
  icon: 'i-lucide-inbox',
  badge: '4'
}, 
{
  label: 'Contacts',
  icon: 'i-lucide-users'
}, 
{
  label: 'Settings',
  icon: 'i-lucide-settings',
  defaultOpen: true,
  children: [{
    label: 'General',
    to: '/settings/general'
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

    <slot />
    
  </UDashboardGroup>
</template>
