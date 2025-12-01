<script setup lang="ts">
definePageMeta({
    title: 'Help',
})

const { contactContent } = useOurganize()

const contactForm = reactive({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium'
})

const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref('')

const priorities = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Urgent', value: 'urgent' }
]

const resetForm = () => {
    contactForm.name = ''
    contactForm.email = ''
    contactForm.subject = ''
    contactForm.message = ''
    contactForm.priority = 'medium'
    submitSuccess.value = false
    submitError.value = ''
}

const submitContact = async () => {
    isSubmitting.value = true
    submitError.value = ''
    
    try {
        // Create mailto link with the form data
        const subject = encodeURIComponent(`[Support: ${contactForm.priority.toUpperCase()}] ${contactForm.subject}`)
        const body = encodeURIComponent(
            `Name: ${contactForm.name}\n` +
            `Email: ${contactForm.email}\n` +
            `Priority: ${contactForm.priority}\n\n` +
            `Message:\n${contactForm.message}`
        )
        
        const mailtoLink = `mailto:${contactContent.value.email}?subject=${subject}&body=${body}`
        
        // Open email client
        window.location.href = mailtoLink
        
        submitSuccess.value = true
        setTimeout(resetForm, 3000)
    } catch (error) {
        submitError.value = 'Failed to open email client. Please try again or email us directly.'
    } finally {
        isSubmitting.value = false
    }
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
        <UDashboardNavbar title="Help Center">
            <template #leading>
                <UDashboardSidebarCollapse variant="subtle" />
            </template>
        </UDashboardNavbar>
      </template>
      <template #body>
          <UContainer class="p-6 space-y-8">
              <!-- Header Section -->
              <div class="text-center space-y-4">
                  <h1 class="text-3xl font-bold text-primary">Help Center</h1>
                  <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                      Get in touch with our support team for personalized assistance.
                  </p>
              </div>

              <!-- Contact Form -->
              <div class="space-y-6">
                  
                  <UCard class="max-w-96 mx-auto">
                      <h2 class="text-2xl font-semibold text-primary mb-6">Contact Support</h2>
                      <UForm :state="contactForm" @submit="submitContact" class="space-y-6">
                          <UFormField label="Your Name" name="name" required>
                              <UInput 
                                  v-model="contactForm.name" 
                                  placeholder="Enter your full name"
                                  :disabled="isSubmitting"
                                  size="lg"
                                  class="w-full"
                                  icon="i-heroicons-user"
                              />
                          </UFormField>
                          
                          <UFormField label="Email Address" name="email" required>
                              <UInput 
                                  v-model="contactForm.email" 
                                  type="email"
                                  placeholder="your.email@example.com"
                                  :disabled="isSubmitting"
                                  size="lg"
                                  class="w-full"
                                  icon="i-heroicons-envelope"
                              />
                          </UFormField>

                          <UFormField label="Subject" name="subject" required>
                              <UInput 
                                  v-model="contactForm.subject" 
                                  placeholder="Brief description of your issue"
                                  :disabled="isSubmitting"
                                  size="lg"
                                  class="w-full"
                                  icon="mdi:help"
                              />
                          </UFormField>
                          
                          <UFormField label="Priority" name="priority">
                              <USelectMenu 
                                  v-model="contactForm.priority"
                                  :options="priorities"
                                  option-attribute="label"
                                  value-attribute="value"
                                  :disabled="isSubmitting"
                                  size="lg"
                                  class="w-full"
                                  icon="mdi:alert-box-outline"
                              />
                          </UFormField>

                          <UFormField label="Message" name="message" required>
                              <UTextarea 
                                  v-model="contactForm.message" 
                                  placeholder="Describe your issue or question in detail..."
                                  :rows="6"
                                  :disabled="isSubmitting"
                                  size="lg"
                                  class="w-full"
                              />
                          </UFormField>

                          <!-- Success Message -->
                          <UAlert 
                              v-if="submitSuccess" 
                              color="success" 
                              variant="subtle"
                              icon="i-heroicons-check-circle"
                          >
                              <template #title>
                                  Message Ready!
                              </template>
                              <template #description>
                                  Your email client should open with the pre-filled message. If it doesn't open, please email us directly at {{ contactContent.email }}.
                              </template>
                          </UAlert>

                          <!-- Error Message -->
                          <UAlert 
                              v-if="submitError" 
                              color="error" 
                              variant="subtle"
                              icon="i-heroicons-exclamation-triangle"
                          >
                              <template #title>
                                  Error
                              </template>
                              <template #description>
                                  {{ submitError }}
                              </template>
                          </UAlert>

                          <!-- Submit Button -->
                          <div class="flex justify-end space-x-4">
                              <UButton 
                                  type="button" 
                                  variant="outline" 
                                  @click="resetForm"
                                  :disabled="isSubmitting"
                                  size="lg"
                              >
                                  Clear Form
                              </UButton>
                              <UButton 
                                  type="submit" 
                                  :loading="isSubmitting"
                                  size="lg"
                              >
                                  Send Message
                              </UButton>
                          </div>
                      </UForm>
                  </UCard>
              </div>

              <!-- Additional Resources -->
              <div class="space-y-6">
                  <h2 class="text-2xl font-semibold text-primary">Additional Resources</h2>
                  <div class="grid md:grid-cols-3 gap-6">
                      <UCard>
                          <div class="text-center space-y-4">
                              <UIcon name="i-heroicons-book-open" class="w-12 h-12 mx-auto text-primary" />
                              <h3 class="font-semibold">Documentation</h3>
                              <p class="text-sm text-gray-600 dark:text-gray-400">
                                  Browse our comprehensive guides and tutorials.
                              </p>
                              <UButton variant="outline" size="lg">
                                  View Docs
                              </UButton>
                          </div>
                      </UCard>
                      
                      <UCard>
                          <div class="text-center space-y-4">
                              <UIcon name="i-heroicons-video-camera" class="w-12 h-12 mx-auto text-primary" />
                              <h3 class="font-semibold">Video Tutorials</h3>
                              <p class="text-sm text-gray-600 dark:text-gray-400">
                                  Watch step-by-step video guides.
                              </p>
                              <UButton variant="outline" size="lg">
                                  Watch Videos
                              </UButton>
                          </div>
                      </UCard>
                      
                      <UCard>
                          <div class="text-center space-y-4">
                              <UIcon name="i-heroicons-users" class="w-12 h-12 mx-auto text-primary" />
                              <h3 class="font-semibold">Community</h3>
                              <p class="text-sm text-gray-600 dark:text-gray-400">
                                  Join our community forum for discussions.
                              </p>
                              <UButton variant="outline" size="lg">
                                  Join Community
                              </UButton>
                          </div>
                      </UCard>
                  </div>
              </div>
          </UContainer>
      </template>
  </UDashboardPanel>
</template>
