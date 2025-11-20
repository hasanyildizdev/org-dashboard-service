<script setup lang="ts">
import type { Contact } from '@/types/core_types'

definePageMeta({
  title: 'Contacts',
  middleware: ['auth', 'verified']
})

const contacts: Contact[] = [
  {
    id: 1,
    name: 'Emily Johnson',
    email: 'emily.johnson@techcorp.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://github.com/emilyjohnson.png',
    company: 'TechCorp Inc.',
    position: 'Senior Developer',
    status: 'online',
    lastSeen: 'now',
    unreadMessages: 3,
    tags: ['client', 'developer', 'priority']
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'm.chen@designstudio.co',
    phone: '+1 (555) 234-5678',
    avatar: 'https://github.com/michaelchen.png',
    company: 'Design Studio Co.',
    position: 'UX Designer',
    status: 'away',
    lastSeen: '2 hours ago',
    unreadMessages: 1,
    tags: ['client', 'designer']
  },
  {
    id: 3,
    name: 'Sarah Williams',
    email: 'sarah.w@startupxyz.com',
    phone: '+1 (555) 345-6789',
    avatar: 'https://github.com/sarahwilliams.png',
    company: 'StartupXYZ',
    position: 'Product Manager',
    status: 'online',
    lastSeen: 'now',
    unreadMessages: 0,
    tags: ['lead', 'manager']
  },
  {
    id: 4,
    name: 'David Rodriguez',
    email: 'david.r@consulting.biz',
    phone: '+1 (555) 456-7890',
    avatar: 'https://github.com/davidrodriguez.png',
    company: 'Consulting Biz',
    position: 'Business Analyst',
    status: 'offline',
    lastSeen: '1 day ago',
    unreadMessages: 0,
    tags: ['consultant', 'analyst']
  },
  {
    id: 5,
    name: 'Lisa Thompson',
    email: 'lisa.thompson@marketingpro.com',
    phone: '+1 (555) 567-8901',
    avatar: 'https://github.com/lisathompson.png',
    company: 'Marketing Pro',
    position: 'Marketing Director',
    status: 'online',
    lastSeen: 'now',
    unreadMessages: 2,
    tags: ['client', 'marketing', 'director']
  },
  {
    id: 6,
    name: 'James Park',
    email: 'j.park@datatech.org',
    phone: '+1 (555) 678-9012',
    avatar: 'https://github.com/jamespark.png',
    company: 'DataTech Org',
    position: 'Data Scientist',
    status: 'away',
    lastSeen: '30 minutes ago',
    unreadMessages: 0,
    tags: ['scientist', 'data']
  },
  {
    id: 7,
    name: 'Rachel Green',
    email: 'rachel.green@financecorp.net',
    phone: '+1 (555) 789-0123',
    avatar: 'https://github.com/rachelgreen.png',
    company: 'Finance Corp',
    position: 'Financial Advisor',
    status: 'offline',
    lastSeen: '3 hours ago',
    unreadMessages: 1,
    tags: ['finance', 'advisor']
  },
  {
    id: 8,
    name: 'Alex Kumar',
    email: 'alex.kumar@cloudservices.io',
    phone: '+1 (555) 890-1234',
    avatar: 'https://github.com/alexkumar.png',
    company: 'Cloud Services',
    position: 'DevOps Engineer',
    status: 'online',
    lastSeen: 'now',
    unreadMessages: 0,
    tags: ['engineer', 'devops', 'cloud']
  }
]

const searchQuery = ref('')
const selectedStatus = ref('all')
const selectedTag = ref('all')

const statusOptions = [
  { label: 'All Contacts', value: 'all' },
  { label: 'Online', value: 'online' },
  { label: 'Away', value: 'away' },
  { label: 'Offline', value: 'offline' }
]

const allTags = computed(() => {
  const tags = new Set<string>()
  contacts.forEach(contact => contact.tags.forEach(tag => tags.add(tag)))
  return [
    { label: 'All Tags', value: 'all' },
    ...Array.from(tags).map(tag => ({ label: tag.charAt(0).toUpperCase() + tag.slice(1), value: tag }))
  ]
})

const filteredContacts = computed(() => {
  return contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         contact.company.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesStatus = selectedStatus.value === 'all' || contact.status === selectedStatus.value
    const matchesTag = selectedTag.value === 'all' || contact.tags.includes(selectedTag.value)
    
    return matchesSearch && matchesStatus && matchesTag
  })
})

const totalUnreadMessages = computed(() => {
  return contacts.reduce((sum, contact) => sum + contact.unreadMessages, 0)
})

function getStatusColor(status: string) {
  switch (status) {
    case 'online': return 'success'
    case 'away': return 'warning'
    case 'offline': return 'neutral'
    default: return 'neutral'
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'online': return 'i-lucide-circle'
    case 'away': return 'i-lucide-clock'
    case 'offline': return 'i-lucide-circle'
    default: return 'i-lucide-circle'
  }
}
</script>

<template>
  <UDashboardPanel resizable class="pb-6">
    <template #resize-handle="{ onMouseDown, onTouchStart, onDoubleClick }">
      <UDashboardResizeHandle
        class="after:absolute after:inset-y-0 after:right-0 after:w-px hover:after:bg-(--ui-border-accented) after:transition"
        @mousedown="onMouseDown"
        @touchstart="onTouchStart"
        @dblclick="onDoubleClick"
      />
    </template>
    
    <template #header>
      <UDashboardNavbar title="Contacts">
        <template #leading>
          <UDashboardSidebarCollapse variant="subtle" />
        </template>
        <template #trailing>
          <div class="flex items-center gap-3">
            <UBadge v-if="totalUnreadMessages > 0" variant="soft" color="primary">
              {{ totalUnreadMessages }} unread
            </UBadge>
            <UButton
              icon="i-lucide-message-circle"
              variant="outline"
              color="primary"
              size="sm"
              to="/contacts/chat"
            >
              Open Chat
            </UButton>
            <UButton
              icon="i-lucide-user-plus"
              variant="solid"
              color="primary"
              size="sm"
            >
              Add Contact
            </UButton>
          </div>
        </template>
      </UDashboardNavbar>
    </template>
    
    <template #body>
      <div class="h-full">
        <UContainer class="py-6 px-6 max-w-7xl h-full">
          <!-- Search and Filters -->
          <div class="mb-6">
            <UCard :ui="{ body: 'p-4' }">
              <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div class="flex-1 min-w-0">
                  <UInput
                    v-model="searchQuery"
                    icon="i-lucide-search"
                    placeholder="Search contacts by name, email, or company..."
                    class="w-full"
                    size="lg"
                  />
                </div>
                <div class="flex gap-3">
                  <USelect
                    v-model="selectedStatus"
                    :options="statusOptions"
                    placeholder="Filter by status"
                    class="w-40"
                  />
                  <USelect
                    v-model="selectedTag"
                    :options="allTags"
                    placeholder="Filter by tag"
                    class="w-40"
                  />
                </div>
              </div>
            </UCard>
          </div>

          <!-- Contact Stats -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <UCard :ui="{ body: 'p-4' }">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <UIcon name="i-lucide-users" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ contacts.length }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Total Contacts</p>
                </div>
              </div>
            </UCard>
            
            <UCard :ui="{ body: 'p-4' }">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <UIcon name="i-lucide-circle" class="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ contacts.filter(c => c.status === 'online').length }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Online</p>
                </div>
              </div>
            </UCard>
            
            <UCard :ui="{ body: 'p-4' }">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <UIcon name="i-lucide-clock" class="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ contacts.filter(c => c.status === 'away').length }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Away</p>
                </div>
              </div>
            </UCard>
            
            <UCard :ui="{ body: 'p-4' }">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <UIcon name="i-lucide-message-circle" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalUnreadMessages }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Unread Messages</p>
                </div>
              </div>
            </UCard>
          </div>

          <!-- Contacts List -->
          <UCard :ui="{ body: 'p-0' }">
            <div class="divide-y divide-gray-200 dark:divide-gray-800">
              <div
                v-for="contact in filteredContacts"
                :key="contact.id"
                class="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 cursor-pointer"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4 flex-1 min-w-0">
                    <div class="relative">
                      <UAvatar
                        :src="contact.avatar"
                        :alt="contact.name"
                        size="lg"
                        :icon="'i-lucide-user'"
                      />
                      <div class="absolute -bottom-1 -right-1">
                        <UBadge
                          :color="getStatusColor(contact.status)"
                          variant="solid"
                          size="sm"
                          class="w-4 h-4 rounded-full p-0 flex items-center justify-center"
                        >
                          <UIcon 
                            :name="getStatusIcon(contact.status)" 
                            class="w-2 h-2" 
                          />
                        </UBadge>
                      </div>
                    </div>
                    
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {{ contact.name }}
                        </h3>
                        <UBadge
                          v-if="contact.unreadMessages > 0"
                          color="primary"
                          variant="solid"
                          size="sm"
                        >
                          {{ contact.unreadMessages }}
                        </UBadge>
                      </div>
                      
                      <div class="grid md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <div class="flex items-center gap-2">
                          <UIcon name="i-lucide-building" class="w-4 h-4" />
                          <span class="truncate">{{ contact.company }} • {{ contact.position }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                          <UIcon name="i-lucide-mail" class="w-4 h-4" />
                          <span class="truncate">{{ contact.email }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                          <UIcon name="i-lucide-phone" class="w-4 h-4" />
                          <span>{{ contact.phone }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                          <UIcon name="i-lucide-clock" class="w-4 h-4" />
                          <span>Last seen: {{ contact.lastSeen }}</span>
                        </div>
                      </div>
                      
                      <div class="flex items-center gap-2 mt-3">
                        <UBadge
                          v-for="tag in contact.tags"
                          :key="tag"
                          variant="soft"
                          color="neutral"
                          size="sm"
                        >
                          {{ tag }}
                        </UBadge>
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-2 ml-4">
                    <UButton
                      icon="i-lucide-message-circle"
                      variant="ghost"
                      color="primary"
                      size="sm"
                      to="/contacts/chat"
                    >
                      Chat
                    </UButton>
                    <UButton
                      icon="i-lucide-phone"
                      variant="ghost"
                      color="success"
                      size="sm"
                    >
                      Call
                    </UButton>
                    <UButton
                      icon="i-lucide-more-horizontal"
                      variant="ghost"
                      color="neutral"
                      size="sm"
                    />
                  </div>
                </div>
              </div>
              
              <div v-if="filteredContacts.length === 0" class="p-12 text-center">
                <UIcon name="i-lucide-users" class="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No contacts found</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your search criteria or filters.
                </p>
                <UButton variant="outline" icon="i-lucide-user-plus">
                  Add New Contact
                </UButton>
              </div>
            </div>
          </UCard>
        </UContainer>
      </div>
    </template>
  </UDashboardPanel>
</template>
