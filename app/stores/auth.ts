import { defineStore } from 'pinia'
import type { User, AuthPayload, LoginCredentials, RegisterCredentials } from '~/types/core_types'
import { ME_QUERY } from '~/graphql/queries'
import { LOGOUT_MUTATION, LOGIN_MUTATION, REGISTER_MUTATION, UPDATE_PROFILE_MUTATION } from '~/graphql/mutations'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    loading: false,
    error: null as Error | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user,
    isEmailVerified: (state) => !!state.user?.email_verified_at
  },

  actions: {
    async login(credentials: LoginCredentials) {
      if (this.user) return

      const token = useCookie('auth_token', {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: 'lax'
      })

      try {
        this.loading = true
        const { mutate } = useMutation<{ login: AuthPayload }>(LOGIN_MUTATION)
        const result = await mutate({
          email: credentials.email,
          password: credentials.password
        })

        if (result?.errors && result.errors.length > 0) {
          const errorMessage = result.errors[0]?.message || 'Login failed. Please check your credentials.'
          console.error('Error in login:', result.errors)
          this.error = new Error(errorMessage)
          return {
            success: false,
            error: errorMessage
          }
        }
      
        token.value = result?.data?.login.access_token || null
        this.user = result?.data?.login.user || null

        return { success: true, user: result?.data?.login.user }
      } catch (error: any) {
        console.error('Login error:', error)
        this.error = error as Error
        return {
          success: false,
          error: error.message || 'Login failed. Please check your credentials.'
        }
      } finally {
        this.loading = false
      }
    },

    async register(credentials: RegisterCredentials) {
      if(this.user) return

      const token = useCookie('auth_token', {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: 'lax'
      })

      try {
        this.loading = true
        const { mutate } = useMutation<{ register: AuthPayload }>(REGISTER_MUTATION)
        const result = await mutate({
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
          password_confirmation: credentials.password_confirmation
        })

        if (result?.errors && result.errors.length > 0) {
          console.error('Error in register:', result.errors)

          // Handle validation errors from GraphQL
          const errorMessages = result.errors.map((err: any) => {
            if (err.extensions?.validation) {
              return Object.values(err.extensions.validation).flat().join(' ')
            }
            return err.message
          }).join(' ')

          this.error = new Error(errorMessages)
          return {
            success: false,
            error: errorMessages
          }
        }
        
        token.value = result?.data?.register.access_token || null
        this.user = result?.data?.register.user || null

        return { success: true, user: result?.data?.register.user }
      } catch (error: any) {
        this.error = error as Error
        console.error('Register error:', error)

        return {
          success: false,
          error: error.message || 'Registration failed. Please try again.'
        }
      } finally {
        this.loading = false
      }
    },

    async logout() {
      if(!this.user) return
      const router = useRouter()
      const token = useCookie('auth_token')
      try {
        const { mutate } = useMutation(LOGOUT_MUTATION)
        const result = await mutate()
        if (result?.errors && result.errors.length > 0) {
          console.error('Error in logout:', result.errors)
          this.error = new Error(result.errors[0]?.message || 'Logout failed')
        }
      } catch (error) {
        this.error = error as Error
        console.error('Logout error:', error)
      } finally {
        token.value = null
        this.user = null
        await router.push('/auth/login')
      }
    },

    async updateProfile(name: string, email: string) {   
      if(!this.user) return
      try {
        this.loading = true
        const { mutate } = useMutation<{ updateProfile: User }>(UPDATE_PROFILE_MUTATION)
        const result = await mutate({
          name,
          email
        })
        
        if (result?.errors && result.errors.length > 0) {
          console.error('Error in update profile:', result.errors)

          // Handle validation errors from GraphQL
          const errorMessages = result.errors.map((err: any) => {
            if (err.extensions?.validation) {
              return Object.values(err.extensions.validation).flat().join(' ')
            }
            return err.message
          }).join(' ')

          this.error = new Error(errorMessages)
          return {
            success: false,
            error: errorMessages
          }
        }
        
        this.user = result?.data?.updateProfile || null
        return { success: true, user: result?.data?.updateProfile }
      } catch (error: any) {
        console.error('Update profile error:', error)
        
        return {
          success: false,
          error: error.message || 'Failed to update profile'
        }
      } finally {
        this.loading = false
      }
    },

    async fetchUser() {
      if(this.user) return
      try {
        this.loading = true
        const { data, error } = await useAsyncQuery<{ me: User }>(ME_QUERY)
        if (error.value) {
          console.error('Error in fetch user:', error.value)
          this.error = error.value as Error
        }
        this.user = data.value?.me || null
        return data.value?.me
      } catch (error: any) {
        this.error = error as Error
        console.error('❌ Fetch user error:', error)
        console.error('Full error:', JSON.stringify(error, null, 2))
        
        // Check if it's an authentication error (401/unauthenticated)
        const isAuthError = error.response?.errors?.some((err: any) => 
          err.message?.toLowerCase().includes('unauthenticated') ||
          err.extensions?.category === 'authentication'
        ) || error.response?.status === 401
        
        if (isAuthError) {
          console.log('🔒 Authentication error - clearing token')
          this.user = null
        } else {
          console.log('⚠️ Non-auth error (network/CORS) - keeping token')
        }
        
        return null
      } finally {
        this.loading = false
      }
    }
  }
})