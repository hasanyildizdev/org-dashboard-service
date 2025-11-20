<script setup lang="ts">
import { Chat } from '@ai-sdk/vue'
import type { UIMessage } from 'ai'
import { getTextFromMessage } from '@nuxt/ui/utils/ai'

definePageMeta({
  title: 'Chat',
  middleware: ['auth']
})

interface Contact {
  id: number
  name: string
  avatar: string
  status: 'online' | 'offline' | 'away'
}

const activeContact = ref<Contact>({
  id: 1,
  name: 'Emily Johnson',
  avatar: 'https://github.com/emilyjohnson.png',
  status: 'online'
})

const onlineContacts: Contact[] = [
  { id: 1, name: 'Emily Johnson', avatar: 'https://github.com/emilyjohnson.png', status: 'online' },
  { id: 3, name: 'Sarah Williams', avatar: 'https://github.com/sarahwilliams.png', status: 'online' },
  { id: 5, name: 'Lisa Thompson', avatar: 'https://github.com/lisathompson.png', status: 'online' },
  { id: 8, name: 'Alex Kumar', avatar: 'https://github.com/alexkumar.png', status: 'online' },
  { id: 2, name: 'Michael Chen', avatar: 'https://github.com/michaelchen.png', status: 'away' },
  { id: 6, name: 'James Park', avatar: 'https://github.com/jamespark.png', status: 'away' }
]

const input = ref('')
const messages: UIMessage[] = [
  {
    id: '1',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        text: 'Hey! 👋 Thanks for reaching out about the new project requirements. I\'ve been reviewing the specs you sent over.'
      }
    ]
  },
  {
    id: '2',
    role: 'user',
    parts: [
      {
        type: 'text',
        text: 'Perfect! What are your initial thoughts? Any concerns about the timeline?'
      }
    ]
  },
  {
    id: '3',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        text: 'The scope looks solid overall! 🚀 A few thoughts:\n\n• **Timeline**: 6 weeks seems tight but doable if we prioritize core features first\n• **Tech Stack**: Love the React + TypeScript approach\n• **Design System**: Should we align with the existing brand guidelines?\n\nI think we can deliver something great! When can we schedule a kickoff call?'
      }
    ]
  },
  {
    id: '4',
    role: 'user',
    parts: [
      {
        type: 'text',
        text: 'Great points! Yes, let\'s stick with existing brand guidelines. How about tomorrow at 2 PM for the kickoff?'
      }
    ]
  },
  {
    id: '5',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        text: 'Perfect! ✅ Tomorrow at 2 PM works great for me. I\'ll send over a calendar invite with the meeting agenda.\n\nIn the meantime, I\'ll prepare:\n• Initial wireframes\n• Technical architecture overview\n• Resource allocation plan\n\nAnything specific you\'d like me to focus on before our call?'
      }
    ]
  }
]

const chat = new Chat({
  messages
})

function handleSubmit(e: Event) {
  e.preventDefault()
  if (input.value.trim()) {
    chat.sendMessage({ text: input.value })
    input.value = ''
  }
}

function selectContact(contact: Contact) {
  activeContact.value = contact
  // In a real app, you'd load the conversation history for this contact
}

function getStatusColor(status: string) {
  switch (status) {
    case 'online': return 'success'
    case 'away': return 'warning'
    case 'offline': return 'neutral'
    default: return 'neutral'
  }
}
</script>

<template>
  <UDashboardPanel resizable :ui="{ body: 'p-0 sm:p-0' }">
    <template #resize-handle="{ onMouseDown, onTouchStart, onDoubleClick }">
      <UDashboardResizeHandle
        class="after:absolute after:inset-y-0 after:right-0 after:w-px hover:after:bg-(--ui-border-accented) after:transition"
        @mousedown="onMouseDown"
        @touchstart="onTouchStart"
        @dblclick="onDoubleClick"
      />
    </template>
    
    <template #header>
      <UDashboardNavbar>
        <template #leading>
          <UDashboardSidebarCollapse variant="subtle" />
        </template>
        
        <template #center>
          <div class="flex items-center gap-3">
            <div class="relative">
              <UAvatar
                :src="activeContact.avatar"
                :alt="activeContact.name"
                size="sm"
                :icon="'i-lucide-user'"
              />
              <div class="absolute -bottom-1 -right-1">
                <UBadge
                  :color="getStatusColor(activeContact.status)"
                  variant="solid"
                  size="sm"
                  class="w-3 h-3 rounded-full p-0"
                />
              </div>
            </div>
            <div class="flex flex-col">
              <h1 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ activeContact.name }}
              </h1>
              <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {{ activeContact.status }}
              </p>
            </div>
          </div>
        </template>
        
        <template #trailing>
          <div class="flex items-center gap-2">
            <UButton
              icon="i-lucide-phone"
              variant="ghost"
              color="success"
              size="sm"
            >
              Call
            </UButton>
            <UButton
              icon="i-lucide-video"
              variant="ghost"
              color="primary"
              size="sm"
            >
              Video
            </UButton>
            <UButton
              icon="i-lucide-arrow-left"
              variant="ghost"
              size="sm"
              to="/contacts"
            >
              Back to Contacts
            </UButton>
          </div>
        </template>
      </UDashboardNavbar>
    </template>
    
    <template #body>
      <div class="h-full flex">
        <!-- Contacts Sidebar -->
        <div class="w-80 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex flex-col">
          <div class="p-4 border-b border-gray-200 dark:border-gray-800">
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Active Chats</h2>
              <UBadge variant="soft" color="primary" size="sm">
                {{ onlineContacts.filter(c => c.status === 'online').length }} online
              </UBadge>
            </div>
            <UInput
              icon="i-lucide-search"
              placeholder="Search conversations..."
              size="sm"
            />
          </div>
          
          <div class="flex-1 overflow-y-auto">
            <div class="p-2 space-y-1">
              <div
                v-for="contact in onlineContacts"
                :key="contact.id"
                @click="selectContact(contact)"
                :class="[
                  'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors duration-200',
                  activeContact.id === contact.id 
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-900 dark:text-primary-100' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'
                ]"
              >
                <div class="relative">
                  <UAvatar
                    :src="contact.avatar"
                    :alt="contact.name"
                    size="md"
                    :icon="'i-lucide-user'"
                  />
                  <div class="absolute -bottom-1 -right-1">
                    <UBadge
                      :color="getStatusColor(contact.status)"
                      variant="solid"
                      size="sm"
                      class="w-3 h-3 rounded-full p-0"
                    />
                  </div>
                </div>
                
                <div class="flex-1 min-w-0">
                  <h3 class="font-medium text-sm truncate">{{ contact.name }}</h3>
                  <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {{ contact.status === 'online' ? 'Active now' : contact.status }}
                  </p>
                </div>
                
                <div class="flex flex-col items-end gap-1">
                  <UBadge
                    v-if="contact.id === 1"
                    color="primary"
                    variant="solid"
                    size="sm"
                  >
                    2
                  </UBadge>
                  <span class="text-xs text-gray-400">2m</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Chat Area -->
        <div class="flex-1 flex flex-col bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
          <div class="flex-1 overflow-hidden">
            <UChatMessages
              :messages="chat.messages"
              :status="chat.status"
              :user="{ 
                side: 'right', 
                variant: 'solid', 
                avatar: { icon: 'i-lucide-user' }
              }"
              :assistant="{
                side: 'left',
                variant: 'outline',
                avatar: {
                  src: activeContact.avatar,
                  alt: activeContact.name
                },
                actions: [
                  {
                    label: 'Copy message',
                    icon: 'i-lucide-copy'
                  },
                  {
                    label: 'Reply',
                    icon: 'i-lucide-reply'
                  }
                ]
              }"
              class="h-full p-6"
            >
              <template #content="{ message }">
                <MDC :value="getTextFromMessage(message)" :cache-key="message.id" unwrap="p" />
              </template>
            </UChatMessages>
          </div>
          
          <!-- Chat Input -->
          <div class="border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4">
            <UChatPrompt
              v-model="input" 
              icon="i-lucide-send"
              :placeholder="`Message ${activeContact.name}...`"
              :error="chat.error" 
              @submit="handleSubmit"
              class="shadow-sm"
            >
              <template #leading>
                <UButton
                  icon="i-lucide-paperclip"
                  variant="ghost"
                  color="neutral"
                  size="sm"
                />
                <UButton
                  icon="i-lucide-smile"
                  variant="ghost"
                  color="neutral"
                  size="sm"
                />
              </template>
              
              <UChatPromptSubmit :status="chat.status" @stop="chat.stop" @reload="chat.regenerate" />
            </UChatPrompt>
            
            <div class="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
              <div class="flex items-center gap-4">
                <span>{{ activeContact.name }} is typing...</span>
              </div>
              <div class="flex items-center gap-1">
                <UIcon name="i-lucide-shield-check" class="w-3 h-3" />
                <span>End-to-end encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
