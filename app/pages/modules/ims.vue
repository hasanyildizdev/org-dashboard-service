<script setup lang="ts">
definePageMeta({
  title: 'IMS',
  middleware: ['auth']
})
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
        <UDashboardNavbar title="Inventory Management System">
            <template #leading>
                <UDashboardSidebarCollapse variant="subtle" />
            </template>
        </UDashboardNavbar>
      </template>
      <template #body>
          <UContainer class="p-6">
            <p class="text-2xl text-primary">Inventory Management System</p>
          </UContainer>
      </template>
  </UDashboardPanel>
</template>
