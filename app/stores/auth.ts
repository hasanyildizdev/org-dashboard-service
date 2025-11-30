import { defineStore } from 'pinia'
import type { 
  User, 
  LoginCredentials, 
  RegisterCredentials 
} from '~/types/core_types'

export const useAuthStore = defineStore('auth', () => {
  // Cookie for user data persistence
  const userCookie = useCookie<User | null>('auth_user', {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
    watch: 'shallow'
  })

  // State - initialize from cookie
  const user = ref<User | null>(userCookie.value || null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  // Watch for cookie changes and sync to state
  watch(userCookie, (newValue) => {
    if (newValue && newValue !== user.value) {
      user.value = newValue
    }
  }, { immediate: true })

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const currentUser = computed(() => user.value)
  const isEmailVerified = computed(() => !!user.value?.email_verified_at)

  // Actions
  function setUser(userData: User | null) {
    user.value = userData
    userCookie.value = userData
  }

  function clearUser() {
    user.value = null
    userCookie.value = null
  }

  /* ----------------------------------------------
   * LOGIN (via secure server API)
   * ---------------------------------------------- */
  async function login(credentials: LoginCredentials) {
    try {
      loading.value = true
      
      // Call server API - it will set httpOnly cookie
      const response = await $fetch<{ success: boolean, user: User }>('/api/auth/login', {
        method: 'POST',
        body: credentials,
      })

      if (!response.success || !response.user) {
        error.value = new Error('Login failed. No user data received.')
        return { success: false, error: 'Login failed' }
      }
      
      setUser(response.user)
      return { success: true, user: response.user }
    } catch (err: any) {
      error.value = err
      return {
        success: false,
        error: err?.data?.message || err?.message || 'Login failed',
      }
    } finally {
      loading.value = false
    }
  }

  /* ----------------------------------------------
   * REGISTER (via secure server API)
   * ---------------------------------------------- */
  async function register(credentials: RegisterCredentials) {
    try {
      loading.value = true
      
      // Call server API - it will set httpOnly cookie
      const response = await $fetch<{ success: boolean, user: User }>('/api/auth/register', {
        method: 'POST',
        body: credentials,
      })

      if (!response.success || !response.user) {
        error.value = new Error('Registration failed. No user data received.')
        return { success: false, error: 'Registration failed' }
      }
      
      setUser(response.user)
      return { success: true, user: response.user }
    } catch (err: any) {
      error.value = err
      return {
        success: false,
        error: err?.data?.message || err?.message || 'Registration failed',
      }
    } finally {
      loading.value = false
    }
  }

  /* ----------------------------------------------
  * LOGOUT (via secure server API)
  * ---------------------------------------------- */
  async function logout() {
    if(!user.value) return
    const router = useRouter()
    
    try {
      // Call server API - it will clear httpOnly cookie
      await $fetch('/api/auth/logout', {
        method: 'POST',
      })
    } catch (err: any) {
      console.error('Logout error:', err)
      error.value = err
    } finally {
      clearUser()
      
      // Clear IndexedDB data on logout
      try {
        const { clearAllData } = await import('~/utils/db')
        await clearAllData()
      } catch (dbError) {
        console.error('❌ Error clearing IndexedDB:', dbError)
      }
      
      await router.push('/auth/login')
    }
  }


  /* ----------------------------------------------
  * FETCH USER (via secure server API)
  * ---------------------------------------------- */
  async function fetchUser() {
    if (user.value) return user.value
    
    try {
      loading.value = true
      
      // Call server API - it will read httpOnly cookie
      const response = await $fetch<{ success: boolean, user: User }>('/api/auth/me')
      
      if (!response.success || !response.user) {
        clearUser()
        return null
      }
      
      setUser(response.user)
      return response.user
    } catch (err: any) {
      clearUser()
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    currentUser,
    isEmailVerified,
    login,
    register,
    logout,
    fetchUser,
    setUser,
    clearUser
  }
})