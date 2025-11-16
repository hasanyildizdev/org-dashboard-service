import { gql } from 'graphql-request'

export interface User {
  id: string
  name: string
  email: string
  email_verified_at?: string
  created_at: string
  updated_at: string
}

export interface AuthPayload {
  access_token: string
  token_type: string
  expires_in: number
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export const useAuth = () => {
  const { $graphql } = useNuxtApp()
  const router = useRouter()
  const user = useState<User | null>('auth_user', () => null)
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
          created_at
          updated_at
        }
      }
    }
  `

  const ME_QUERY = gql`
    query Me {
      me {
        id
        name
        email
        email_verified_at
        created_at
        updated_at
      }
    }
  `

  const LOGOUT_MUTATION = gql`
    mutation Logout {
      logout {
        status
        message
      }
    }
  `

  const login = async (credentials: LoginCredentials) => {
    try {
      const data = await $graphql.request<{ login: AuthPayload }>(LOGIN_MUTATION, {
        email: credentials.email,
        password: credentials.password
      })

      token.value = data.login.access_token
      user.value = data.login.user

      return { success: true, user: data.login.user }
    } catch (error: any) {
      console.error('Login error:', error)
      return { 
        success: false, 
        error: error.response?.errors?.[0]?.message || 'Login failed. Please check your credentials.' 
      }
    }
  }

  const logout = async () => {
    try {
      await $graphql.request(LOGOUT_MUTATION)
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      token.value = null
      user.value = null
      await router.push('/auth/login')
    }
  }

  const fetchUser = async () => {
    if (!token.value) {
      user.value = null
      return null
    }

    try {
      const data = await $graphql.request<{ me: User }>(ME_QUERY)
      user.value = data.me
      return data.me
    } catch (error) {
      console.error('Fetch user error:', error)
      token.value = null
      user.value = null
      return null
    }
  }

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  return {
    user: readonly(user),
    token: readonly(token),
    isAuthenticated,
    login,
    logout,
    fetchUser
  }
}
