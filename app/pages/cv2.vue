<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useUserSkillStore } from '~/stores/user_skill'
import { useUserEducationStore } from '~/stores/user_education'
import { useUserExperienceStore } from '~/stores/user_experience'
import { useUserSocialAccountStore } from '~/stores/user_social_account'

definePageMeta({
  title: 'CV2',
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
  city: user.value?.city || '',
  country: user.value?.country || '',

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
      description: 'A personal website to showcase skills & projects with performance-first design.'
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
      <!-- Top Banner -->
      <div class="bg-white dark:bg-slate-900/60 backdrop-blur rounded-2xl shadow-lg p-6 mb-6 border border-slate-200 dark:border-slate-800/80 transition-colors duration-300">
        <div class="flex items-center gap-4">
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
          <div class="ml-auto text-right hidden md:block">
            <p class="text-sm text-slate-600 dark:text-slate-500">
              {{ [cvData.city, cvData.country].filter(Boolean).join(', ') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Grid layout: left sidebar / main / right skills -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

        <!-- LEFT SIDEBAR (compact contact + socials + languages) -->
        <aside class="md:col-span-1 space-y-6">
            <div class="sticky top-6 space-y-6">
                <UCard class="p-5 shadow-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors duration-300">
                  <h3 class="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">Contact</h3>
                  <ul class="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    <li v-for="c in cvData.contact" :key="c.label" class="flex items-center gap-3">
                      <UIcon :name="c.icon" class="text-slate-600 dark:text-slate-400" />
                      <span class="truncate text-slate-700 dark:text-slate-300">{{ c.label }}</span>
                    </li>
                  </ul>
      
                  <USeparator class="my-4" />
      
                  <h3 class="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">Social</h3>
                  <ul class="mt-3 space-y-2 text-sm">
                    <li v-for="s in cvData.socials" :key="s.url" class="flex items-center gap-3">
                      <UIcon :name="s.icon" class="text-slate-600 dark:text-slate-400" />
                      <a :href="s.url" target="_blank" class="truncate text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline transition-colors">{{ s.url }}</a>
                    </li>
                  </ul>
      
                  <USeparator class="my-4" />
      
                  <h3 class="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">Languages</h3>
                  <ul class="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    <li v-for="l in cvData.languages" :key="l.name">{{ l.name }} — <span class="text-slate-500 dark:text-slate-400">{{ l.level }}</span></li>
                  </ul>
                </UCard>
      
                 <UCard class="p-5 top-6 shadow-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors duration-300">
                  <h3 class="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">Skills</h3>
                  <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">Proficiency shown as relative percentage. Hover a bar to see value.</p>
      
                  <ul class="mt-3 space-y-3">
                    <li v-for="skill in cvData.skills" :key="skill.label">
                      <div class="flex justify-between items-center">
                        <span class="text-sm font-medium text-slate-900 dark:text-slate-50">{{ skill.label }}</span>
                        <span class="text-xs text-slate-600 dark:text-slate-400">{{ skill.level }}%</span>
                      </div>
                      <div class="mt-1 h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden" role="progressbar" :aria-valuenow="Number(skill.level)" aria-valuemin="0" aria-valuemax="100">
                        <div class="h-full rounded-full transition-all duration-700" :style="{ width: skill.level + '%', background: 'linear-gradient(90deg, #7c3aed, #06b6d4)' }"></div>
                      </div>
                    </li>
                  </ul>
                </UCard>
            </div>
        </aside>

        <!-- MAIN CONTENT (experience, projects, education) -->
        <main class="md:col-span-2 md:col-start-2 space-y-6">

          <UCard class="p-6 shadow-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <h2 class="section-title">Experience</h2>
            <div v-for="exp in cvData.experiences" :key="exp.year" class="mt-4">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-sm text-slate-600 dark:text-slate-500">{{ exp.year }}</p>
                  <p class="font-semibold text-slate-900 dark:text-slate-50">{{ exp.role }} <span class="text-slate-600 dark:text-slate-400">— {{ exp.company }}</span></p>
                  <p class="mt-1 text-sm text-slate-700 dark:text-slate-300">{{ exp.description }}</p>
                </div>
              </div>
            </div>
          </UCard>
         
          <UCard class="p-6 shadow-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <h2 class="section-title">Education</h2>
            <div v-for="edu in cvData.education" :key="edu.year" class="mt-3">
              <p class="text-sm text-slate-600 dark:text-slate-500">{{ edu.year }}</p>
              <p class="font-semibold text-slate-900 dark:text-slate-50">{{ edu.degree }}</p>
              <p class="text-sm text-slate-700 dark:text-slate-300">{{ edu.college }}</p>
            </div>
          </UCard>

          <UCard class="p-6 shadow-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <h2 class="section-title">Projects</h2>
            <ul class="space-y-4 mt-3">
              <li v-for="pr in cvData.projects" :key="pr.name" class="group">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-semibold text-slate-900 dark:text-slate-50">{{ pr.name }} <span class="text-xs text-slate-600 dark:text-slate-400">({{ pr.tech }})</span></p>
                    <p class="text-sm text-slate-700 dark:text-slate-300">{{ pr.description }}</p>
                  </div>
                  <a :href="pr.link" target="_blank" class="text-indigo-600 dark:text-indigo-400 text-sm opacity-0 group-hover:opacity-100 transition hover:text-indigo-700 dark:hover:text-indigo-300">Open</a>
                </div>
              </li>
            </ul>
          </UCard>
        </main>

        <!-- RIGHT COLUMN: Skills (moved here) + CTA -->
        <aside class="space-y-6">
         
        </aside>
      </div>

    <UFooter class="mt-6 border-slate-200 dark:border-slate-800/80 text-center text-[11px] text-slate-500 dark:text-slate-400 transition-colors duration-300">
        {{ new Date().getFullYear() }} — Developed by Ourganize
      </UFooter>
    </UContainer>
  </UPage>
</template>

<style scoped>
/* Removed @apply due to Tailwind CSS issues. Use utility classes directly in the template instead. */

/* subtle glass look for cards and nicer shadow */
.u-card {
  transition: transform .18s ease, box-shadow .18s ease;
}
.u-card:hover {
  transform: translateY(-4px);
}

/* responsive tweaks */
@media (min-width: 768px) {
  aside .u-card { position: sticky; }
}

/* Section title styling for dark/light modes */
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
