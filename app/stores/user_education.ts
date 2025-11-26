import { defineStore } from 'pinia'
import { GET_USER_EDUCATIONS } from '~/graphql/queries'
import { 
  CREATE_USER_EDUCATION_MUTATION,
  UPDATE_USER_EDUCATION_MUTATION,
  DELETE_USER_EDUCATION_MUTATION 
} from '~/graphql/mutations'
import { useApolloClient } from '@vue/apollo-composable'
import type { UserEducation, UserEducationInput, UserEducationsData } from '~/types/core_types'

export const useUserEducationStore = defineStore('user_education', () => {
  // State
  const userEducations = ref<UserEducation[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)
  
  // Get auth token and apollo client
  const authToken = useCookie('auth_token')
  const apollo = useApolloClient().client

  /* ----------------------------------------------
   * FETCH USER EDUCATIONS
   * ---------------------------------------------- */
  async function fetchUserEducations(force = false) {
    // Don't fetch again if already loaded unless forced
    if (userEducations.value.length > 0 && !force) {
      return
    }

    try {
      loading.value = true
      const { data, errors } = await apollo.query<UserEducationsData>({
        query: GET_USER_EDUCATIONS,
        fetchPolicy: force ? 'network-only' : 'cache-first',
        context: {
          headers: {
            Authorization: authToken.value ? `Bearer ${authToken.value}` : ''
          }
        }
      })
      
      if (errors && errors.length > 0) {
        console.error('Error fetching user educations:', errors)
        error.value = new Error(errors[0]?.message || 'Failed to fetch user educations')
        return
      }
      
      userEducations.value = data?.userEducations || []
    } catch (err: any) {
      console.error('Error fetching user educations:', err)
      error.value = err as Error
    } finally {
      loading.value = false
    }
  }

  /* ----------------------------------------------
   * CREATE USER EDUCATION
   * ---------------------------------------------- */
  async function createUserEducation(input: UserEducationInput) {
    try {
      loading.value = true
      const result = await apollo.mutate({
        mutation: CREATE_USER_EDUCATION_MUTATION,
        variables: { input },
        context: {
          headers: {
            Authorization: authToken.value ? `Bearer ${authToken.value}` : ''
          }
        }
      })
      
      if (result.errors && result.errors.length > 0) {
        const messages = result.errors
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
      
      const newEducation = result.data?.createUserEducation
      if (newEducation) {
        userEducations.value = [...userEducations.value, newEducation]
      }
      
      return { success: true, education: newEducation }
    } catch (err: any) {
      console.error('Error creating user education:', err)
      error.value = err as Error
      return { success: false, error: err?.message ?? 'Failed to create education' }
    } finally {
      loading.value = false
    }
  }

  /* ----------------------------------------------
   * UPDATE USER EDUCATION
   * ---------------------------------------------- */
  async function updateUserEducation(id: string, input: UserEducationInput) {
    try {
      loading.value = true
      const result = await apollo.mutate({
        mutation: UPDATE_USER_EDUCATION_MUTATION,
        variables: { id, input },
        context: {
          headers: {
            Authorization: authToken.value ? `Bearer ${authToken.value}` : ''
          }
        }
      })
      
      if (result.errors && result.errors.length > 0) {
        const messages = result.errors
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
      
      const updatedEducation = result.data?.updateUserEducation
      if (updatedEducation) {
        userEducations.value = userEducations.value.map((edu) =>
          edu.id === id ? updatedEducation : edu
        )
      }
      
      return { success: true, education: updatedEducation }
    } catch (err: any) {
      console.error('Error updating user education:', err)
      error.value = err as Error
      return { success: false, error: err?.message ?? 'Failed to update education' }
    } finally {
      loading.value = false
    }
  }

  /* ----------------------------------------------
   * DELETE USER EDUCATION
   * ---------------------------------------------- */
  async function deleteUserEducation(id: string) {
    try {
      loading.value = true
      const result = await apollo.mutate({
        mutation: DELETE_USER_EDUCATION_MUTATION,
        variables: { id },
        context: {
          headers: {
            Authorization: authToken.value ? `Bearer ${authToken.value}` : ''
          }
        }
      })
      
      if (result.errors && result.errors.length > 0) {
        const messages = result.errors
          .map((err: any) => err.message)
          .join(' ')
        error.value = new Error(messages)
        return { success: false, error: messages }
      }
      
      // Remove from local state
      userEducations.value = userEducations.value.filter(e => e.id !== id)
      
      return { success: true }
    } catch (err: any) {
      console.error('Error deleting user education:', err)
      error.value = err as Error
      return { success: false, error: err?.message ?? 'Failed to delete education' }
    } finally {
      loading.value = false
    }
  }


  return {
    userEducations,
    loading,
    error,
    fetchUserEducations,
    createUserEducation,
    updateUserEducation,
    deleteUserEducation
  }
})