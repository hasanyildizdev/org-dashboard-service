<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useUserSkillStore } from '~/stores/user_skill'
import { useUserEducationStore } from '~/stores/user_education'
import { useUserExperienceStore } from '~/stores/user_experience'
import { useUserSocialAccountStore } from '~/stores/user_social_account'

definePageMeta({
  title: 'CV',
  layout: 'cv',
})

const user = computed(() => useAuthStore().user)
const skillStore = useUserSkillStore()
const educationStore = useUserEducationStore()
const experienceStore = useUserExperienceStore()
const socialAccountStore = useUserSocialAccountStore()

onMounted(async () => {
  await Promise.all([
    skillStore.fetchUserSkills(),
    educationStore.fetchUserEducations(),
    experienceStore.fetchUserExperiences(),
    socialAccountStore.fetchUserSocialAccounts()
  ])
})

const cvData = computed(() => ({
  name: user.value?.name || '',
  title: user.value?.profession?.name || '',
  avatar: user.value?.avatar || '',

  contact: [
    { icon: 'i-heroicons-envelope', label: user.value?.email || '' },
    { icon: 'i-heroicons-phone', label: user.value?.phone || '' },
    { icon: 'i-heroicons-map-pin', label: [user.value?.city, user.value?.country].filter(Boolean).join(', ') }
  ],

  socials: socialAccountStore.userSocialAccounts.map(account => {
    // Map provider to icon
    const getSocialIcon = (provider: string): string => {
      const icons: Record<string, string> = {
        github: 'i-simple-icons-github',
        linkedin: 'i-simple-icons-linkedin',
        twitter: 'i-simple-icons-x',
        instagram: 'i-simple-icons-instagram',
        facebook: 'i-simple-icons-facebook',
        youtube: 'i-simple-icons-youtube',
        tiktok: 'i-simple-icons-tiktok',
        dribbble: 'i-simple-icons-dribbble',
        behance: 'i-simple-icons-behance',
        medium: 'i-simple-icons-medium',
        dev: 'i-simple-icons-devdotto',
        stackoverflow: 'i-simple-icons-stackoverflow'
      }
      return icons[provider.toLowerCase()] || 'i-lucide-link'
    }
    
    // Generate URL based on provider
    const getSocialUrl = (provider: string, username: string): string => {
      const urls: Record<string, string> = {
        github: `https://github.com/${username}`,
        linkedin: `https://linkedin.com/in/${username}`,
        twitter: `https://twitter.com/${username.replace('@', '')}`,
        instagram: `https://instagram.com/${username.replace('@', '')}`,
        facebook: `https://facebook.com/${username}`,
        youtube: `https://youtube.com/${username}`,
        tiktok: `https://tiktok.com/@${username.replace('@', '')}`,
        dribbble: `https://dribbble.com/${username}`,
        behance: `https://behance.net/${username}`,
        medium: `https://medium.com/@${username.replace('@', '')}`,
        dev: `https://dev.to/${username}`,
        stackoverflow: `https://stackoverflow.com/users/${username}`
      }
      return urls[provider.toLowerCase()] || `https://www.${provider}.com/${username}`
    }
    
    return {
      icon: getSocialIcon(account.provider),
      url: getSocialUrl(account.provider, account.username)
    }
  }),

  skills: skillStore.userSkills.map(skill => ({
    label: skill.name,
    level: skill.level
  })),

  education: educationStore.userEducations.map(education => ({
    year: education.education_period || '',
    degree: `${education.degree || ''}${education.field_of_study ? ` in ${education.field_of_study}` : ''}`,
    college: education.institution || ''
  })),

  experiences: experienceStore.userExperiences.map(experience => ({
    year: experience.experience_period || '',
    role: experience.title || '',
    company: experience.company || '',
    description: experience.description || '',
    is_current: experience.is_current || false
  })),

  projects: [
    {
      name: 'Portfolio Website',
      tech: 'Nuxt, Tailwind',
      link: 'https://hasanyildiz.com',
      description: 'A personal website to showcase skills & projects.'
    },
    {
      name: 'Task Manager App',
      tech: 'Vue, Firebase',
      link: '#',
      description: 'Full CRUD app with authentication and real-time DB.'
    }
  ],

  languages: [
    { name: 'Turkish', level: 'Native' },
    { name: 'English', level: 'Professional' }
  ]
}))
</script>

<template>
  <UPage class="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 transition-colors duration-300">
    <UContainer class="max-w-5xl mx-auto">
      <UCard
        class="overflow-hidden border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 shadow-xl dark:shadow-2xl dark:shadow-slate-950/60 backdrop-blur transition-colors duration-300"
        :ui="{ body: 'p-6 md:p-8' }"
      >
        <!-- Header -->
        <header
          class="flex flex-col gap-6 border-b border-slate-200 dark:border-slate-800/80 pb-6 md:flex-row md:items-center md:justify-between transition-colors duration-300"
        >
          <UUser
            :to="cvData.avatar"
            target="_blank"
            :name="cvData.name"
            :description="cvData.title"
            :avatar="{
              src: cvData.avatar
            }"
            :ui="{
              name: 'font-bold text-2xl'
            }"
            size="3xl"
          />

          <div class="flex flex-row items-start gap-4 text-xs text-slate-600 dark:text-slate-300 md:items-end transition-colors duration-300">
            <div class="flex flex-wrap justify-end">
              <div class="w-full flex flex-col justify-start gap-1">
                <UButton
                  v-for="s in cvData.socials"
                  :key="s.url"
                  variant="ghost"
                  size="xs"
                  color="primary"
                  :to="s.url"
                  target="_blank"
                  class="gap-2 hover:bg-primary-900/30 hover:scale-105 transition-all duration-200"
                >
                  <UIcon :name="s.icon" class="h-4 w-4" />
                  <span class="hidden text-xs font-medium sm:inline">
                    {{ s.url.replace('https://', '').replace('http://', '').replace('www.', '') }}
                  </span>
                </UButton>
              </div>
            </div>
            <ul class="space-y-1">
              <li
                v-for="item in cvData.contact"
                :key="item.label"
                class="flex items-center gap-2"
              >
                <UIcon :name="item.icon" class="size-6 text-primary-500 dark:text-primary-300" />
                <span class="truncate text-base text-slate-700 dark:text-slate-200">{{ item.label }}</span>
              </li>
            </ul>
          </div>
        </header>

        <!-- Content -->
        <div class="mt-8 grid gap-8 md:grid-cols-[1.6fr,1fr]">

          <!-- Experience -->
          <UClientOnly>
            <section class="mb-6">
              <h2 class="section-title">
                Experience
              </h2>
              <ol class="mt-4 space-y-6 border-l border-slate-300 dark:border-slate-800/80 pl-5 transition-colors duration-300">
                <li
                  v-for="exp in cvData.experiences"
                  :key="exp.year"
                  class="relative group"
                >
                  <span
                    v-if="exp.is_current"
                    class="absolute -left-[9px] top-1 h-3 w-3 rounded-full border border-white dark:border-slate-900 bg-primary-500 shadow-[0_0_0_3px_rgba(59,130,246,0.35)] group-hover:shadow-[0_0_0_5px_rgba(59,130,246,0.5)] transition-shadow"
                  />
                  <div class="bg-slate-100 dark:bg-slate-800/30 rounded-lg p-4 -ml-2 border border-slate-300 dark:border-slate-800/50 group-hover:bg-slate-200 dark:group-hover:bg-slate-800/50 transition-colors duration-300">
                    <p class="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
                      {{ exp.year }}
                    </p>
                    <p class="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-1">
                      {{ exp.role }}
                      <span class="text-slate-600 dark:text-slate-400"> · {{ exp.company }}</span>
                    </p>
                    <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {{ exp.description }}
                    </p>
                  </div>
                </li>
              </ol>
            </section>
          </UClientOnly>

          <!-- Skills -->
          <UClientOnly>
            <section class="mb-6">
              <h2 class="section-title">
                Skills
              </h2>
              <div class="mt-4 flex flex-wrap gap-2">
                <UBadge
                  v-for="skill in cvData.skills"
                  :key="skill.label"
                  variant="soft"
                  color="primary"
                  class="bg-slate-200 dark:bg-slate-800/80 text-[11px] font-medium text-slate-700 dark:text-slate-50 hover:bg-primary-100 dark:hover:bg-primary-800/60 hover:text-primary-700 dark:hover:text-primary-100 hover:scale-105 transition-all duration-200 cursor-default"
                >
                  {{ skill.label }}
                  <span
                    v-if="skill.level"
                    class="ml-1 text-[11px] font-normal text-slate-500 dark:text-slate-300"
                  >
                    · {{ skill.level }}
                  </span>
                </UBadge>
              </div>
            </section>
          </UClientOnly>
          
          <!-- Education -->
          <UClientOnly>
            <section class="mb-6">
              <h2 class="section-title">
                Education
              </h2>
              <div class="mt-4 space-y-4">
                <div
                  v-for="edu in cvData.education"
                  :key="edu.year"
                  class="rounded-lg border border-slate-300 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 p-4 hover:border-slate-400 dark:hover:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-900/90 transition-all duration-300 group"
                >
                  <p class="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
                    {{ edu.year }}
                  </p>
                  <p class="text-sm font-semibold text-slate-900 dark:text-slate-50 group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors mb-1">
                    {{ edu.degree }}
                  </p>
                  <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {{ edu.college }}
                  </p>
                </div>
              </div>
            </section>
          </UClientOnly>

                    <!-- Projects -->
          <section>
            <h2 class="section-title">
              Projects
            </h2>
            <div class="mt-4 grid gap-4">
              <UCard
                v-for="project in cvData.projects"
                :key="project.name"
                class="border-slate-300 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 group hover:border-slate-400 dark:hover:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-900/90 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/40"
                :ui="{ body: 'p-4' }"
              >
                <div class="flex flex-col gap-3">
                  <div class="flex items-start justify-between gap-3">
                    <p class="text-sm font-semibold text-slate-900 dark:text-slate-50 group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors">
                      {{ project.name }}
                    </p>
                    <UBadge
                      size="xs"
                      variant="subtle"
                      class="whitespace-nowrap bg-slate-200 dark:bg-slate-800/80 text-[11px] text-slate-700 dark:text-slate-200 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 group-hover:text-primary-700 dark:group-hover:text-primary-200 transition-colors"
                    >
                      {{ project.tech }}
                    </UBadge>
                  </div>
                  <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {{ project.description }}
                  </p>
                  <a
                    v-if="project.link"
                    :href="project.link"
                    target="_blank"
                    class="inline-flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-300 hover:text-primary-700 dark:hover:text-primary-200 hover:underline group-hover:translate-x-1 transition-all"
                  >
                    <span>{{ project.link }}</span>
                    <UIcon
                      name="i-heroicons-arrow-top-right-on-square-20-solid"
                      class="h-3 w-3"
                    />
                  </a>
                </div>
              </UCard>
            </div>
          </section>

          <!-- Languages -->
          <section>
            <h2 class="section-title">
              Languages
            </h2>
            <div class="mt-4 space-y-3">
              <div
                v-for="lang in cvData.languages"
                :key="lang.name"
                class="flex items-center justify-between p-3 rounded-lg border border-slate-300 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 hover:border-slate-400 dark:hover:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-900/90 transition-all duration-300 group"
              >
                <span class="text-xs font-medium text-slate-900 dark:text-slate-50 group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors">
                  {{ lang.name }}
                </span>
                <span class="text-xs text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                  {{ lang.level }}
                </span>
              </div>
            </div>
          </section>

        </div>
      </UCard>

      <UFooter class="mt-6 border-slate-200 dark:border-slate-800/80 text-center text-[11px] text-slate-500 dark:text-slate-400 transition-colors duration-300">
        {{ new Date().getFullYear() }} — Developed by Ourganize
      </UFooter>
    </UContainer>
  </UPage>
</template>

<style scoped>
.section-title {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dark .section-title {
  color: #9ca3af;
}

.section-title::after {
  content: '';
  flex: 1 1 0%;
  height: 1px;
  background: linear-gradient(to right, rgba(100, 116, 139, 0.8), transparent);
}

.dark .section-title::after {
  background: linear-gradient(to right, rgba(148, 163, 184, 0.8), transparent);
}
</style>
