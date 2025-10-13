<script setup lang="ts">
import { Chat } from '@ai-sdk/vue'
import type { UIMessage } from 'ai'
import { getTextFromMessage } from '@nuxt/ui/utils/ai'
const input = ref('')
const messages: UIMessage[] = [
  {
    id: '6045235a-a435-46b8-989d-2df38ca2eb47',
    role: 'user',
    parts: [
      {
        type: 'text',
        text: 'Hello, how are you?'
      }
    ]
  },
  {
    id: '7a92b3c1-d5f8-4e76-b8a9-3c1e5fb2e0d8',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        text: 'I am doing well, thank you for asking! How can I assist you today?'
      }
    ]
  },
  {
    id: '9c84d6a7-8b23-4f12-a1d5-e7f3b9c05e2a',
    role: 'user',
    parts: [
      {
        type: 'text',
        text: 'What is the current weather in Tokyo?'
      }
    ]
  },
  {
    id: 'b2e5f8c3-a1d9-4e67-b3f2-c9d8e7a6b5f4',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        text: "Based on the latest data, Tokyo is currently experiencing sunny weather with temperatures around 24°C (75°F). It's a beautiful day with clear skies."
      }
    ]
  }
]
const chat = new Chat({
  messages
})
function handleSubmit(e: Event) {
  e.preventDefault()
  chat.sendMessage({ text: input.value })
  input.value = ''
}
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
        <UDashboardNavbar title="Chat">
            <template #leading>
                <UDashboardSidebarCollapse variant="subtle" />
            </template>
        </UDashboardNavbar>
    </template>
    <template #body>
        <UContainer class="max-w-2xl mx-auto">
            <UChatMessages
            :messages="chat.messages"
            :status="chat.status"
            :user="{ side: 'right', variant: 'naked', avatar: { src: 'https://github.com/benjamincanac.png' } }"
            :assistant="{
                side: 'left',
                variant: 'outline',
                avatar: {
                    icon: 'i-lucide-bot'
                },
                actions: [
                    {
                    label: 'Copy to clipboard',
                    icon: 'i-lucide-copy'
                    }
                ]
            }">
            <template #content="{ message }">
                <MDC :value="getTextFromMessage(message)" :cache-key="message.id" unwrap="p" />
            </template>
            </UChatMessages>
        </UContainer>
    </template>
    <template #footer>
        <UContainer class="max-w-2xl mx-auto mb-2">
            <UChatPrompt
                 v-model="input" 
                 icon="i-lucide-message-circle"
                 :error="chat.error" 
                 @submit="handleSubmit">
                <UChatPromptSubmit :status="chat.status" @stop="chat.stop" @reload="chat.regenerate" />
            </UChatPrompt>
        </UContainer> 
    </template>
</UDashboardPanel>
</template>
