import { defineStore } from 'pinia'
import type { 
  User, 
  AuthPayload, 
  LoginCredentials, 
  RegisterCredentials 
} from '~/types/core_types'
import { ME_QUERY } from '~/graphql/queries'
import { 
  LOGOUT_MUTATION, 
  LOGIN_MUTATION, 
  REGISTER_MUTATION, 
} from '~/graphql/mutations'

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
    if (userData) {
      console.log('✅ User data saved to cookie:', userData.name)
    }
  }

  function clearUser() {
    user.value = null
    userCookie.value = null
  }

  /* ----------------------------------------------
   * LOGIN
   * ---------------------------------------------- */
  async function login(credentials: LoginCredentials) {
      const tokenCookie = useCookie('auth_token', {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: 'lax'
      })
    try {
      loading.value = true
      const apollo = useApolloClient().client
      const result = await apollo.mutate({
        mutation: LOGIN_MUTATION,
        variables: credentials
      })

      const payload: AuthPayload | null = result?.data?.login ?? null
      if (!payload) {
        error.value = new Error('Login failed. No response returned.')
        return { success: false, error: 'Login failed' }
      }
      tokenCookie.value = payload?.access_token ?? null
      // User data already includes profession from backend
      setUser(payload?.user ?? null)
      return { success: true, user: payload.user }
    } catch (err: any) {
      error.value = err
      return {
        success: false,
        error: err?.message ?? 'Login failed',
      }
    } finally {
      loading.value = false
    }
  }

  /* ----------------------------------------------
   * REGISTER
   * ---------------------------------------------- */
  async function register(credentials: RegisterCredentials) {
      const tokenCookie = useCookie('auth_token', {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: 'lax'
      })

    try {
      loading.value = true
      const apollo = useApolloClient().client
      const result = await apollo.mutate({
        mutation: REGISTER_MUTATION,
        variables: {
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
          password_confirmation: credentials.password_confirmation,
        },
      })
      const payload: AuthPayload | null = result?.data?.register ?? null
      if (!payload) {
        const errors = result?.errors
        if (errors?.length) {
          const messages = errors
            .map((err: any) => {
              if (err.extensions?.validation) {
                return Object.values(err.extensions.validation).flat().join(' ')
              }
              return err.message
            })
            .join(' ')

          error.value = new Error(messages)
          return { success: false, error: messages }
        }
        error.value = new Error('Registration failed. No response returned.')
        return { success: false, error: 'Registration failed' }
      }
      tokenCookie.value = payload.access_token ?? null
      setUser(payload.user ?? null)
      return { success: true, user: payload.user }
    } catch (err: any) {
      error.value = err
      return {
        success: false,
        error: err?.message ?? 'Registration failed',
      }
    } finally {
      loading.value = false
    }
  }

  /* ----------------------------------------------
  * LOGOUT
  * ---------------------------------------------- */
  async function logout() {
    if(!user.value) return
      const router = useRouter()
      const tokenCookie = useCookie('auth_token')
      try {
        const apollo = useApolloClient().client
        await apollo.mutate({
          mutation: LOGOUT_MUTATION,
        })
      } catch (err: any) {
        console.error('Logout error:', err)
        error.value = err
    } finally {
      tokenCookie.value = null
      clearUser()
      await router.push('/auth/login')
    }
  }


  /* ----------------------------------------------
  * FETCH USER
  * ---------------------------------------------- */
  async function fetchUser() {
    if (user.value) return user.value
    
    const tokenCookie = useCookie('auth_token')
    if (!tokenCookie.value) {
      clearUser()
      return null
    }
    
    try {
      loading.value = true
      const apollo = useApolloClient().client
      const { data } = await apollo.query({
        query: ME_QUERY,
        fetchPolicy: 'network-only',
        context: {
          headers: {
            Authorization: `Bearer ${tokenCookie.value}`
          }
        }
      })
      const fetchedUser = data?.me ?? null
      setUser(fetchedUser)
      return fetchedUser
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