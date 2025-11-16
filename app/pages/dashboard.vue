<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { user, logout } = useAuth()
</script>

<template>
  <UPage>
    <UPageHeader>
      <template #headline>
        <UBadge label="Dashboard" color="primary" variant="subtle" />
      </template>
      <template #title>
        Welcome back, {{ user?.name }}!
      </template>
      <template #description>
        You are successfully logged in to your dashboard.
      </template>
      <template #actions>
        <UButton 
          label="Logout" 
          color="error" 
          @click="logout"
        />
      </template>
    </UPageHeader>
    
    <UPageBody>
      <UContainer>
        <div class="grid gap-6">
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold">User Information</h3>
            </template>
            <div class="space-y-2">
              <div>
                <span class="font-medium">Name:</span> {{ user?.name }}
              </div>
              <div>
                <span class="font-medium">Email:</span> {{ user?.email }}
              </div>
              <div>
                <span class="font-medium">User ID:</span> {{ user?.id }}
              </div>
            </div>
          </UCard>
        </div>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
