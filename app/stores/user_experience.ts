import { defineStore } from 'pinia'
import type { 
  UserExperience, 
  UserExperienceInput 
} from '~/types/core_types'
import { GET_USER_EXPERIENCES } from '~/graphql/queries'
import { 
  CREATE_USER_EXPERIENCE_MUTATION,
  UPDATE_USER_EXPERIENCE_MUTATION,
  DELETE_USER_EXPERIENCE_MUTATION 
} from '~/graphql/mutations'
import { useApolloClient } from '@vue/apollo-composable'
import {
  getAllExperiences,
  saveAllExperiences,
  saveExperience,
  deleteExperience as deleteExperienceFromDB
} from '~/utils/db'

export const useUserExperienceStore = defineStore('user_experience', () => {
  const apollo = useApolloClient().client
  const loading = ref(false)
  const main_error = ref<{ message: string } | null>(null)
  const isInitialized = ref(false)
  
  // State - IndexedDB only (no cookies, unlimited size)
  const userExperiences = ref<UserExperience[]>([])

  /**
   * Initialize from IndexedDB on first access (client-only)
   */
  async function initFromIndexedDB() {
    if (import.meta.server || isInitialized.value) return
    
    try {
      const cached = await getAllExperiences()
      if (cached.length > 0) {
        userExperiences.value = cached
      }
      isInitialized.value = true
    } catch (error) {
      console.error('❌ Error loading from IndexedDB:', error)
      isInitialized.value = true
    }
  }

  /* ----------------------------------------------
   * FETCH USER EXPERIENCES
   * ---------------------------------------------- */
  async function fetchUserExperiences(force = false): Promise<UserExperience[]> {
    // Initialize from IndexedDB first
    await initFromIndexedDB()
    
    // If we have data and not forcing, return immediately
    if (userExperiences.value.length > 0 && !force) {
      return userExperiences.value 
    }

    // Fetch from API
    try {
      loading.value = true

      const { data, error } = await apollo.query({
        query: GET_USER_EXPERIENCES,
        fetchPolicy: force ? 'network-only' : 'cache-first'
      })
      
      if (error) {
        console.error('❌ Error fetching user experiences:', error)
        main_error.value = { message: error.message || 'Failed to fetch user experiences' }
        return []
      }
      
      const experiences = data?.userExperiences || []
      userExperiences.value = experiences
      
      // Save to IndexedDB
      if (import.meta.client) {
        try {
          await saveAllExperiences(experiences)
        } catch (dbError) {
          console.error('❌ Error saving to IndexedDB:', dbError)
        }
      }
      
      return experiences
    } catch (err: any) {
      console.error('❌ Error fetching user experiences:', err)
      main_error.value = { message: err?.message || 'Failed to fetch user experiences' }
      return []
    } finally {
      loading.value = false
    }
  }

  /* ----------------------------------------------
   * CREATE USER EXPERIENCE
   * ---------------------------------------------- */
  async function createUserExperience(input: UserExperienceInput) {
    try {
      loading.value = true
      const result = await apollo.mutate({
        mutation: CREATE_USER_EXPERIENCE_MUTATION,
        variables: { input }
      })
      
      if (result.errors && result.errors.length > 0) {
        const messages = result.errors
          .map((err: any) => {
            if (err.extensions?.validation) {
              const validationObj = err.extensions.validation
              const errors: string[] = []
              for (const key in validationObj) {
                const value = validationObj[key]
                if (Array.isArray(value)) {
                  errors.push(...value)
                } else {
                  errors.push(String(value))
                }
              }
              return errors.join(' ')
            }
            return err.message
          })
          .join(' ')
        main_error.value = { message: messages }
        return { success: false, error: messages }
      }

      const newExperience = result.data?.createUserExperience
      if (newExperience) {
        // Create new array to avoid read-only issues
        userExperiences.value = [newExperience, ...userExperiences.value]
        
        // Save to IndexedDB
        if (import.meta.client) {
          try {
            await saveAllExperiences(userExperiences.value)
          } catch (dbError) {
            console.error('❌ Error saving to IndexedDB:', dbError)
          }
        }
        
        return { success: true, experience: newExperience }
      }
      
      return { success: false, error: 'No data returned from mutation' }
    } catch (err: any) {
      console.error('❌ Error creating experience:', err)
      main_error.value = { message: err?.message || 'Failed to create experience' }
      return { success: false, error: err?.message ?? 'Failed to create experience' }
    } finally {
      loading.value = false
    }
  }

  /* ----------------------------------------------
   * UPDATE USER EXPERIENCE
   * ---------------------------------------------- */
  async function updateUserExperience(id: string, input: UserExperienceInput) {
    try {
      loading.value = true
      const result = await apollo.mutate({
        mutation: UPDATE_USER_EXPERIENCE_MUTATION,
        variables: { id, input }
      })

      if (result.errors && result.errors.length > 0) {
        const messages = result.errors
          .map((err: any) => {
            if (err.extensions?.validation) {
              const validationObj = err.extensions.validation
              const errors: string[] = []
              for (const key in validationObj) {
                const value = validationObj[key]
                if (Array.isArray(value)) {
                  errors.push(...value)
                } else {
                  errors.push(String(value))
                }
              }
              return errors.join(' ')
            }
            return err.message
          })
          .join(' ')
        main_error.value = { message: messages }
        return { success: false, error: messages }
      }

      const updatedExperience = result.data?.updateUserExperience
      if (!updatedExperience) {
        main_error.value = { message: 'No data returned from mutation' }
        return { success: false, error: 'No data returned from mutation' }
      }
      
      const index = userExperiences.value.findIndex(exp => exp.id === id)
      if (index !== -1) {
        // Create new array to avoid read-only issues
        const newExperiences = [...userExperiences.value]
        newExperiences[index] = updatedExperience
        userExperiences.value = newExperiences
      }
      
      // Save to IndexedDB
      if (import.meta.client) {
        try {
          await saveAllExperiences(userExperiences.value)
        } catch (dbError) {
          console.error('❌ Error saving to IndexedDB:', dbError)
        }
      }
      
      return { success: true, experience: updatedExperience }
    } catch (err: any) {
      console.error('❌ Error updating experience:', err)
      main_error.value = { message: err?.message || 'Failed to update experience' }
      return { success: false, error: err?.message ?? 'Failed to update experience' }
    } finally {
      loading.value = false
    }
  }

  /* ----------------------------------------------
   * DELETE USER EXPERIENCE
   * ---------------------------------------------- */
  async function deleteUserExperience(id: string) {
    try {
      loading.value = true
      const result = await apollo.mutate({
        mutation: DELETE_USER_EXPERIENCE_MUTATION,
        variables: { id }
      })
      
      if (result.errors && result.errors.length > 0) {
        const messages = result.errors.map((err: any) => err.message).join(' ')
        main_error.value = { message: messages }
        return { success: false, error: messages }
      }

      if (result.data?.deleteUserExperience) {
        userExperiences.value = userExperiences.value.filter(exp => exp.id !== id)
        
        // Delete from IndexedDB
        if (import.meta.client) {
          try {
            await deleteExperienceFromDB(id)
          } catch (dbError) {
            console.error('❌ Error deleting from IndexedDB:', dbError)
          }
        }
        
        return { success: true }
      }
      
      return { success: false, error: 'Failed to delete experience' }
    } catch (err: any) {
      console.error('❌ Error deleting experience:', err)
      main_error.value = { message: err?.message || 'Failed to delete experience' }
      return { success: false, error: err?.message ?? 'Failed to delete experience' }
    } finally {
      loading.value = false
    }
  }

  /* ----------------------------------------------
   * CLEAR USER EXPERIENCES
   * ---------------------------------------------- */
  async function clearUserExperiences() {
    userExperiences.value = []
    isInitialized.value = false
    main_error.value = null
    
    if (import.meta.server) return
    
    try {
      await saveAllExperiences([])
    } catch (error) {
      console.error('❌ Error clearing experiences:', error)
    }
  }

  return {
    userExperiences,
    loading,
    main_error,
    isInitialized,
    fetchUserExperiences,
    createUserExperience,
    updateUserExperience,
    deleteUserExperience,
    clearUserExperiences
  }
})
