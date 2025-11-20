import { defineStore } from 'pinia'
import { gql } from 'graphql-request'
import type { User, AuthPayload, LoginCredentials, RegisterCredentials } from '~/types/core_types'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    loading: false,
    initialized: false,
    fetchAttempts: 0
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user,
    isEmailVerified: (state) => !!state.user?.email_verified_at
  },

  actions: {
    async login(credentials: LoginCredentials) {
      const { $graphql } = useNuxtApp()
      const token = useCookie('auth_token', {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: 'lax'
      })

      const LOGIN_MUTATION = gql`
        mutation Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            access_token
            token_type
            expires_in
            user {
              id
              name
              email
              email_verified_at
              avatar
              created_at
              updated_at
            }
          }
        }
      `

      try {
        this.loading = true
        const data = await $graphql.request<{ login: AuthPayload }>(LOGIN_MUTATION, {
          email: credentials.email,
          password: credentials.password
        })

        token.value = data.login.access_token
        this.user = data.login.user

        return { success: true, user: data.login.user }
      } catch (error: any) {
        console.error('Login error:', error)
        return {
          success: false,
          error: error.response?.errors?.[0]?.message || 'Login failed. Please check your credentials.'
        }
      } finally {
        this.loading = false
      }
    },

    async register(credentials: RegisterCredentials) {
      const { $graphql } = useNuxtApp()
      const token = useCookie('auth_token', {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: 'lax'
      })

      const REGISTER_MUTATION = gql`
        mutation Register($name: String!, $email: String!, $password: String!, $password_confirmation: String!) {
          register(name: $name, email: $email, password: $password, password_confirmation: $password_confirmation) {
            access_token
            token_type
            expires_in
            user {
              id
              name
              email
              email_verified_at
              avatar
              created_at
              updated_at
            }
          }
        }
      `

      try {
        this.loading = true
        const data = await $graphql.request<{ register: AuthPayload }>(REGISTER_MUTATION, {
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
          password_confirmation: credentials.password_confirmation
        })

        token.value = data.register.access_token
        this.user = data.register.user

        return { success: true, user: data.register.user }
      } catch (error: any) {
        console.error('Register error:', error)

        // Handle validation errors
        const errors = error.response?.errors
        if (errors && Array.isArray(errors)) {
          const errorMessages = errors.map((err: any) => {
            if (err.extensions?.validation) {
              return Object.values(err.extensions.validation).flat().join(' ')
            }
            return err.message
          }).join(' ')

          return {
            success: false,
            error: errorMessages
          }
        }

        return {
          success: false,
          error: error.response?.errors?.[0]?.message || 'Registration failed. Please try again.'
        }
      } finally {
        this.loading = false
      }
    },

    async logout() {
      const { $graphql } = useNuxtApp()
      const router = useRouter()
      const token = useCookie('auth_token')

      const LOGOUT_MUTATION = gql`
        mutation Logout {
          logout {
            status
            message
          }
        }
      `

      try {
        await $graphql.request(LOGOUT_MUTATION)
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        token.value = null
        this.user = null
        await router.push('/auth/login')
      }
    },

    async updateProfile(name: string, email: string) {
      const { $graphql } = useNuxtApp()
      
      const UPDATE_PROFILE_MUTATION = gql`
        mutation UpdateProfile($name: String!, $email: String!) {
          updateProfile(name: $name, email: $email) {
            id
            name
            email
            email_verified_at
            avatar
            created_at
            updated_at
          }
        }
      `
      
      try {
        const data = await $graphql.request<{ updateProfile: User }>(UPDATE_PROFILE_MUTATION, {
          name,
          email
        })
        
        this.user = data.updateProfile
        return { success: true, user: data.updateProfile }
      } catch (error: any) {
        console.error('Update profile error:', error)
        
        // Handle validation errors
        const errors = error.response?.errors
        if (errors && Array.isArray(errors)) {
          const errorMessages = errors.map((err: any) => {
            if (err.extensions?.validation) {
              return Object.values(err.extensions.validation).flat().join(' ')
            }
            return err.message
          }).join(' ')
          
          return {
            success: false,
            error: errorMessages
          }
        }
        
        return {
          success: false,
          error: error.response?.errors?.[0]?.message || 'Failed to update profile'
        }
      }
    },

    async fetchUser() {
      const nuxtApp = useNuxtApp()
      const token = useCookie('auth_token')

      if (!token.value) {
        this.user = null
        this.initialized = true
        return null
      }
      
      // Check if GraphQL client is available
      if (!nuxtApp.$graphql) {
        console.error('❌ GraphQL client not available in fetchUser')
        this.initialized = false // Allow retry
        return null
      }
      
      const { $graphql } = nuxtApp

      const ME_QUERY = gql`
        query Me {
          me {
            id
            name
            email
            email_verified_at
            avatar
            profession_id
            profession {
              id
              name
              slug
            }
            created_at
            updated_at
          }
        }
      `

      try {
        this.loading = true
        this.fetchAttempts++
        const data = await $graphql.request<{ me: User }>(ME_QUERY)
        this.user = data.me
        this.initialized = true
        this.fetchAttempts = 0 // Reset on success
        return data.me
      } catch (error: any) {
        console.error('❌ Fetch user error:', error)
        console.error('Full error:', JSON.stringify(error, null, 2))
        
        // Check if it's an authentication error (401/unauthenticated)
        const isAuthError = error.response?.errors?.some((err: any) => 
          err.message?.toLowerCase().includes('unauthenticated') ||
          err.extensions?.category === 'authentication'
        ) || error.response?.status === 401
        
        if (isAuthError) {
          console.log('🔒 Authentication error - clearing token and marking initialized')
          token.value = null
          this.user = null
          this.initialized = true
          this.fetchAttempts = 0
        } else {
          console.log('⚠️ Non-auth error (network/CORS) - keeping token')
          
          // If we've tried too many times, give up and mark as initialized
          if (this.fetchAttempts >= 3) {
            console.log('⛔ Too many failed attempts - marking initialized to prevent loop')
            this.initialized = true
            this.user = null
          } else {
            console.log('⚠️ Will retry on next navigation')
            this.initialized = false // Allow retry
            this.user = null
          }
        }
        
        return null
      } finally {
        this.loading = false
      }
    }
  }
})
