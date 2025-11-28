<script setup lang="ts">
definePageMeta({
  title: 'Edit Profile',
})
const router = useRouter()
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
        <UDashboardNavbar title="Edit Profile">
            <template #leading>
                <UDashboardSidebarCollapse variant="subtle" />
            </template>
        </UDashboardNavbar>
      </template>
      <template #body>
          <UContainer class="p-6">
            <div class="max-w-2xl mx-auto space-y-6">
              <!-- Back Button -->
              <div>
                <UButton
                  icon="i-lucide-arrow-left"
                  label="Back to Profile"
                  variant="ghost"
                  @click="router.push('/profile')"
                />
              </div>

              <!-- Profile Picture Section -->
              <Profile/>

              <!-- Skills Section -->
              <Skills/>

              <!-- Social Accounts Section -->
              <SocialAccounts/>

              <!-- Experiences Section -->
              <Experiences/>

              <!-- Educations Section -->
              <Educations/>

            </div>
          </UContainer>
      </template>
  </UDashboardPanel>
</template>
