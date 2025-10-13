<script setup lang="ts">
import Logo from '@/components/svg/Logo.vue';

type LogoSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

interface Props {
  size?: LogoSize
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const sizeClasses = {
  sm: {
    logo: 'w-6 h-6',
    text: 'text-base',
    spacing: 'ml-1'
  },
  md: {
    logo: 'w-8 h-8',
    text: 'text-lg',
    spacing: 'ml-[5px]'
  },
  lg: {
    logo: 'w-10 h-10',
    text: 'text-xl',
    spacing: 'ml-2'
  },
  xl: {
    logo: 'w-12 h-12',
    text: 'text-2xl',
    spacing: 'ml-2'
  },
  '2xl': {
    logo: 'w-16 h-16',
    text: 'text-3xl',
    spacing: 'ml-3'
  }
}

const currentSize = computed(() => sizeClasses[props.size])
</script>
<template>
    <NuxtLink to="/" class="flex items-center justify-center">
        <Logo :class="`${currentSize.logo} fill-primary dark:fill-white`"/>
        <span :class="`${currentSize.spacing} ${currentSize.text} font-semibold text-primary dark:text-white`">Ourganize</span>
    </NuxtLink>
</template>
