<script setup lang="ts">
definePageMeta({
  title: 'Organa',
})

const features = [
  {
    title: 'Analyze Your Data',
    desc: 'Collects and interprets your activity, performance and financial data to surface meaningful patterns and opportunities.',
    icon: 'i-lucide-chart-line',
    color: 'blue'
  },
  {
    title: 'Wise Suggestions',
    desc: 'Actionable recommendations prioritized by impact and feasibility — clear steps you can take right away.',
    icon: 'i-lucide-lightbulb',
    color: 'amber'
  },
  {
    title: 'Personal Improvement Plans',
    desc: 'Tailored roadmaps and micro-goals designed to help you improve consistently and measurably.',
    icon: 'i-lucide-target',
    color: 'green'
  },
  {
    title: 'Optimize for Profit & Efficiency',
    desc: 'Find the highest-value levers to increase profit, reduce waste, and optimize resource allocation.',
    icon: 'i-lucide-trending-up',
    color: 'emerald'
  },
  {
    title: 'Progress Tracking & Insights',
    desc: 'Track metrics over time, visualize trends, and get summaries of what changed and why.',
    icon: 'i-lucide-bar-chart-3',
    color: 'purple'
  },
  {
    title: 'Forecasting & What-Ifs',
    desc: 'Scenario simulations and short-term forecasts to help you plan and test decisions before committing.',
    icon: 'i-lucide-crystal-ball',
    color: 'indigo'
  },
  {
    title: 'Seamless Integrations',
    desc: 'Connects to your tools and data sources so Organa sees the full picture and gives better guidance.',
    icon: 'i-lucide-plug',
    color: 'cyan'
  },
  {
    title: 'Data Privacy & Security',
    desc: 'User-first privacy design: encrypted storage, permissioned access and clear data controls.',
    icon: 'i-lucide-shield-check',
    color: 'red'
  }
]

const stats = [
  { label: 'Data Points Analyzed', value: '10M+' },
  { label: 'Optimization Suggestions', value: '500K+' },
  { label: 'Success Rate', value: '94%' },
  { label: 'Time Saved', value: '40%' }
]

const benefits = [
  'Real-time intelligent recommendations',
  'Automated pattern recognition',
  'Personalized improvement strategies',
  'Predictive analytics and forecasting'
]
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
      <UDashboardNavbar title="Organa AI Mentor">
        <template #leading>
          <UDashboardSidebarCollapse variant="subtle" />
        </template>
        <template #trailing>
          <UButton 
            icon="mdi:robot" 
            variant="outline" 
            color="success"
            size="sm"
            to="/organa/chat"
          >
            Chat with Organa
          </UButton>
        </template>
      </UDashboardNavbar>
    </template>
    
    <template #body>
      <div class="min-h-full">
        <UContainer class="py-12 px-6 max-w-6xl">
          <!-- Hero Section -->
          <div class="text-center mb-16">
            <div class="flex justify-center mb-6">
              <UAvatar
                :icon="'i-lucide-robot'"
                size="xl"
                class="bg-gradient-to-br from-primary-500 to-primary-600 text-white ring-4 ring-primary-100 dark:ring-primary-900/30"
              />
            </div>
            
            <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Meet 
              <span class="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                Organa
              </span>
            </h1>
            
            <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Your intelligent AI mentor that analyzes your data, provides actionable insights, 
              and guides you toward measurable success with personalized recommendations.
            </p>

            <UButton 
              size="lg" 
              icon="i-lucide-message-circle"
              class="px-8"
              color="success"
              to="/organa/chat">
              Start Chatting
            </UButton>
          </div>

          <!-- Stats Section -->
          <div class="mb-16">
            <UCard :ui="{ body: 'p-8' }">
              <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <div 
                  v-for="stat in stats" 
                  :key="stat.label"
                  class="text-center"
                >
                  <div class="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                    {{ stat.value }}
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    {{ stat.label }}
                  </div>
                </div>
              </div>
            </UCard>
          </div>

          <!-- Features Section -->
          <div class="mb-16">
            <div class="text-center mb-12">
              <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Powerful AI Capabilities
              </h2>
              <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Organa combines advanced analytics with intuitive guidance to transform 
                how you approach business decisions and personal growth.
              </p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <UCard
                v-for="feature in features"
                :key="feature.title"
                :ui="{ 
                  body: 'p-6'
                }"
                class="group hover:-translate-y-1 transition-transform duration-200 ring-1 ring-gray-200 dark:ring-gray-800 shadow-sm hover:shadow-md transition-all"
              >
                <div class="flex items-start gap-4">
                  <div 
                    :class="`w-12 h-12 rounded-xl bg-${feature.color}-100 dark:bg-${feature.color}-900/30 
                             flex items-center justify-center text-${feature.color}-600 dark:text-${feature.color}-400 
                             group-hover:scale-110 transition-transform duration-200`"
                  >
                    <UIcon :name="feature.icon" class="w-6 h-6" />
                  </div>
                  
                  <div class="flex-1 min-w-0">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {{ feature.title }}
                    </h3>
                    <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {{ feature.desc }}
                    </p>
                  </div>
                </div>
              </UCard>
            </div>
          </div>

          <!-- Benefits Section -->
          <div class="mb-16">
            <UCard :ui="{ body: 'p-8' }" class="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-950/50 dark:to-secondary-950/50">
              <div class="grid md:grid-cols-2 gap-8 items-center">
                <div class="sm:pl-6">
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Why Choose Organa?
                  </h2>
                  <ul class="space-y-4">
                    <li 
                      v-for="benefit in benefits" 
                      :key="benefit"
                      class="flex items-center gap-3"
                    >
                      <UIcon 
                        name="i-lucide-check-circle" 
                        class="w-5 h-5 text-green-500 flex-shrink-0" 
                      />
                      <span class="text-gray-700 dark:text-gray-300">{{ benefit }}</span>
                    </li>
                  </ul>
                </div>
                
                <div class="text-center">
                  <div class="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white mb-4">
                    <UIcon name="i-lucide-brain-circuit" class="w-16 h-16" />
                  </div>
                  <p class="text-lg font-medium text-gray-900 dark:text-white">
                    AI-Powered Intelligence
                  </p>
                  <p class="text-gray-600 dark:text-gray-300 mt-2">
                    Advanced machine learning that evolves with your needs
                  </p>
                  <UButton 
                    size="lg" 
                    icon="i-lucide-message-circle"
                    class="px-8 mt-4"
                    to="/organa/chat"
                    color="success"
                    variant="outline"
                  >
                    Chat with Organa
                  </UButton>
                </div>
              </div>
            </UCard>
          </div>
        </UContainer>
      </div>
    </template>
  </UDashboardPanel>
</template>

