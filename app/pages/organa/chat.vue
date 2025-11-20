<script setup lang="ts">
import { Chat } from '@ai-sdk/vue'
import type { UIMessage } from 'ai'
import { getTextFromMessage } from '@nuxt/ui/utils/ai'

definePageMeta({
  title: 'Organa Chat',
  middleware: ['auth']
})


const input = ref('')
const messages: UIMessage[] = [
  {
    id: '6045235a-a435-46b8-989d-2df38ca2eb47',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        text: '👋 Hello! I\'m **Organa**, your intelligent AI mentor. I\'m here to help you analyze your data, provide strategic insights, and guide you toward measurable success.\n\nI can assist you with:\n- 📊 Data analysis and pattern recognition\n- 💡 Strategic recommendations\n- 🎯 Personal improvement planning\n- 📈 Performance optimization\n- 🔮 Forecasting and scenario planning\n\nWhat would you like to explore today?'
      }
    ]
  },
  {
    id: '7a92b3c1-d5f8-4e76-b8a9-3c1e5fb2e0d8',
    role: 'user',
    parts: [
      {
        type: 'text',
        text: 'Can you help me analyze my business performance?'
      }
    ]
  },
  {
    id: '9c84d6a7-8b23-4f12-a1d5-e7f3b9c05e2a',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        text: 'Absolutely! I\'d be happy to help you analyze your business performance. 📊\n\nTo provide you with the most relevant insights, I\'ll need to understand your specific situation better. Could you share:\n\n**Business Context:**\n- What industry are you in?\n- What\'s the size of your business (employees, revenue range)?\n- What specific metrics are you most concerned about?\n\n**Current Challenges:**\n- Are there particular areas where you feel performance is lacking?\n- What goals are you trying to achieve?\n\n**Available Data:**\n- What kind of business data do you currently track?\n- Do you have access to sales, marketing, operational, or financial metrics?\n\nOnce I understand your context better, I can provide targeted recommendations and help you identify the most impactful areas for improvement! 🎯'
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
            <UAvatar
              icon="i-lucide-robot"
              size="sm"
              class="bg-gradient-to-br from-primary-500 to-primary-600 text-white"
            />
            <div class="flex flex-col">
              <h1 class="text-lg font-semibold text-gray-900 dark:text-white">
                Organa AI Mentor
              </h1>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Your intelligent business advisor
              </p>
            </div>
          </div>
        </template>
        
        <template #trailing>
          <div class="flex items-center gap-2">
            <UBadge variant="soft" color="success" size="sm">
              <UIcon name="i-lucide-circle" class="w-2 h-2 mr-1" />
              Online
            </UBadge>
            <UButton
              icon="i-lucide-arrow-left"
              variant="ghost"
              size="sm"
              to="/organa"
            >
              Back to Organa
            </UButton>
          </div>
        </template>
      </UDashboardNavbar>
    </template>
    
    <template #body>
      <div class="h-full bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
        <UContainer class="max-w-4xl mx-auto h-full">
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
                icon: 'i-lucide-robot',
                class: 'bg-gradient-to-br from-primary-500 to-primary-600 text-white'
              },
              actions: [
                {
                  label: 'Copy response',
                  icon: 'i-lucide-copy'
                },
                {
                  label: 'Regenerate',
                  icon: 'i-lucide-refresh-cw'
                }
              ]
            }"
            class="py-6"
          >
            <template #content="{ message }">
              <MDC :value="getTextFromMessage(message)" :cache-key="message.id" unwrap="p" />
            </template>
          </UChatMessages>
        </UContainer>
      </div>
    </template>
    
    <template #footer>
      <div class="border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <UContainer class="max-w-4xl mx-auto py-4">
          <UChatPrompt
            v-model="input" 
            icon="i-lucide-send"
            placeholder="Ask Organa about your business strategy, data analysis, or growth opportunities..."
            :error="chat.error" 
            @submit="handleSubmit"
            class="shadow-lg [&_input]:text-sm [&_button]:bg-primary-600 [&_button]:hover:bg-primary-700"
          >
            <UChatPromptSubmit :status="chat.status" @stop="chat.stop" @reload="chat.regenerate"/>
          </UChatPrompt>
          
          <div class="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
            <div class="flex items-center gap-4">
              <span>💡 Try asking: "Analyze my sales data" or "Help me create a growth strategy"</span>
            </div>
            <div class="flex items-center gap-1">
              <UIcon name="i-lucide-shield-check" class="w-3 h-3" />
              <span>Secure & Private</span>
            </div>
          </div>
        </UContainer>
      </div>
    </template>
  </UDashboardPanel>
</template>
