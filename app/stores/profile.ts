import { defineStore } from 'pinia'
import type { 
  User, 
  Profession,
} from "~/types/core_types";
import { GET_PROFESSIONS } from '~/graphql/queries'
import { 
  UPDATE_PROFILE_MUTATION,
  DELETE_ACCOUNT_MUTATION 
} from '~/graphql/mutations'
import { useAuthStore } from '~/stores/auth'

export const useProfileStore = defineStore('profile', () => {
  const apollo = useApolloClient().client
  const professions = ref<Profession[]>([])
  const loading = ref(false)
  const main_error = ref<Error | null>(null)
  const authToken = useCookie('auth_token')

  // Action to fetch professions
  async function fetchProfessions() {
    // Don't fetch again if already loaded
    if (professions.value.length > 0) {
      return
    }

    try {
      loading.value = true
      
      const { data, error } = await apollo.query({
        query: GET_PROFESSIONS,
        context: {
          headers: {
            Authorization: authToken.value ? `Bearer ${authToken.value}` : ''
          }
        }
      })
      
      if (error) {
        console.error('Error fetching professions:', error)
        main_error.value = new Error(error.message || 'Failed to fetch professions')
        return
      }
      
      professions.value = data?.professions || []
    } catch (err: any) {
      console.error('Error fetching professions:', err)
      main_error.value = err as Error
    } finally {
      loading.value = false
    }
  }


  /* ----------------------------------------------
   * UPDATE PROFILE
   * ---------------------------------------------- */
  async function updateProfile(name: string, email: string, profession_id: number) {
    try {
      loading.value = true
      const apollo = useApolloClient().client
      
      const result = await apollo.mutate({
        mutation: UPDATE_PROFILE_MUTATION,
        variables: { name, email, profession_id },
        context: {
          headers: {
            Authorization: authToken.value ? `Bearer ${authToken.value}` : ''
          }
        }
      })
      const updatedUser: User | null = result?.data?.updateProfile ?? null
      if (!updatedUser) {
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

          main_error.value = new Error(messages)
          return { success: false, error: messages }
        }
        return { success: false, error: 'Profile update failed' }
      }
      useAuthStore().setUser(updatedUser)
      return { success: true, user: updatedUser }
    } catch (err: any) {
      console.error('Update profile error:', err)
      return { success: false, error: err?.message ?? 'Update failed' }
    } finally {
      loading.value = false
    }
  }
  
  async function deleteAccount() {
    try {
      loading.value = true
      const apollo = useApolloClient().client
      
      const result = await apollo.mutate({
        mutation: DELETE_ACCOUNT_MUTATION,
        context: {
          headers: {
            Authorization: authToken.value ? `Bearer ${authToken.value}` : ''
          }
        }
      })
      const deletedUser: User | null = result?.data?.deleteAccount ?? null
      if (!deletedUser) {
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
          main_error.value = new Error(messages)
          return { success: false, error: messages }
        }
        return { success: false, error: 'Account deletion failed' }
      }
      // Clear auth state
      authToken.value = null
      useAuthStore().clearUser()
      return { success: true, user: deletedUser }
    } catch (err: any) {
      console.error('Delete account error:', err)
      return { success: false, error: err?.message ?? 'Delete failed' }
    } finally {
      loading.value = false
    }
  }

  return { 
    professions,
    loading,
    main_error,
    updateProfile,
    deleteAccount,
    fetchProfessions
  }
})