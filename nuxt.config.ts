// https://nuxt.com/docs/api/configuration/nuxt-config
import meta from './app/config/meta'
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  devServer: {
    port: 3001,
    host: '0.0.0.0'
  },

  css: ['~/assets/css/main.css'],

  app: {
    baseURL: '/dashboard',
    head: {
      title: 'Ourganize - Dashboard',
      meta: meta,
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1.0',
      htmlAttrs: {
        lang: 'en'
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  nitro: {
    prerender: {
      routes: ['/']
    }
  },

  modules: [
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@nuxtjs/apollo',
    '@nuxt/icon'
  ],

  components: [
    {
      path: '~/components',
      pathPrefix: false,   
      extensions: ['.vue'],
    },
  ],

  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'en',
    locales: [
      {code: 'tr', name: 'Türkçe'},
      {code: 'de', name: 'Deutsch'},
      {code: 'en', name: 'English'},
      {code: 'fr', name: 'Français'},
      {code: 'es', name: 'Español'},
    ],
    vueI18n: "~/config/i18n.config",
  },

  colorMode: {
    preference: 'system',
    fallback: 'light',
    storageKey: 'ourganize-color-mode',
    classSuffix: '',
  },

  typescript: {
    typeCheck: false
  },

  apollo: {
    clients: {
      default: {
        httpEndpoint: process.env.BACKEND_API_URL + '/graphql',
        tokenStorage: 'cookie',
        tokenName: 'auth_token',
        authType: 'Bearer',
        authHeader: 'Authorization',
      },
    },
  },
  
  runtimeConfig: {
    public: {
      apiUrl: process.env.BACKEND_API_URL || 'http://localhost:8000',
      websiteUrl: process.env.WEBSITE_URL || 'http://localhost:3000',
    }
  }
})