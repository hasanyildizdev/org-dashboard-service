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
        // Use server proxy endpoint with baseURL prefix
        httpEndpoint: '/dashboard/api/graphql',
        // Don't try to read token from cookie (it's httpOnly)
        tokenStorage: 'cookie',
        tokenName: 'auth_token',
        // Server handles auth, so don't add headers client-side
        httpLinkOptions: {
          credentials: 'include', // Send cookies with requests
        },
      },
    },
  },
  
  runtimeConfig: {
    public: {
      apiUrl: process.env.BACKEND_API_URL || 'http://localhost:8000',
      websiteUrl: process.env.WEBSITE_URL || 'http://localhost:3000',
    }
  },

  routeRules: {
    '/**': {
      headers: {
        'Content-Security-Policy': [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Nuxt/Vite needs inline scripts
          "style-src 'self' 'unsafe-inline'", // Vue/Tailwind needs inline styles
          "img-src 'self' data: blob: https:", // Allow images from CDN
          "font-src 'self' data:", // Allow fonts
          "connect-src 'self' ws: wss: http://localhost:* http://127.0.0.1:*", // Allow API/WebSocket
          "frame-src 'self' data:", // Allow iframes for DevTools and error overlays
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "frame-ancestors 'none'",
          "upgrade-insecure-requests"
        ].join('; ')
      }
    }
  }
})