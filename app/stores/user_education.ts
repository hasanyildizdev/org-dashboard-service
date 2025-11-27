import { defineStore } from 'pinia'
import type { 
  UserEducation, 
  UserEducationInput 
} from '~/types/core_types'
import { GET_USER_EDUCATIONS } from '~/graphql/queries'
import { 
  CREATE_USER_EDUCATION_MUTATION,
  UPDATE_USER_EDUCATION_MUTATION,
  DELETE_USER_EDUCATION_MUTATION 
} from '~/graphql/mutations'
import { useApolloClient } from '@vue/apollo-composable'
import {
  getAllEducations,
  saveAllEducations,
  saveEducation,
  deleteEducation as deleteEducationFromDB
} from '~/utils/db'

export const useUserEducationStore = defineStore('user_education', () => {
  const apollo = useApolloClient().client
  const loading = ref(false)
  const main_error = ref<{ message: string } | null>(null)
  const isInitialized = ref(false)
  
  // State - IndexedDB only (no cookies, unlimited size)
  const userEducations = ref<UserEducation[]>([])

  /**
   * Initialize from IndexedDB on first access (client-only)
   */
  async function initFromIndexedDB() {
    if (import.meta.server || isInitialized.value) return
    
    try {
      const cached = await getAllEducations()
      if (cached.length > 0) {
        userEducations.value = cached
        console.log(`⚡ Loaded ${cached.length} educations from IndexedDB`)
      }
      isInitialized.value = true
    } catch (error) {
      console.error('❌ Error loading from IndexedDB:', error)
      isInitialized.value = true
    }
  }

  /**
   * Clear all educations from memory and IndexedDB
   */
  async function clearUserEducations() {
    userEducations.value = []
    isInitialized.value = false
    
    if (import.meta.server) return
    
    try {
      await saveAllEducations([])
      console.log('🗑️ Educations cleared from IndexedDB')
    } catch (error) {
      console.error('❌ Error clearing educations:', error)
    }
  }

  /* ----------------------------------------------
   * FETCH USER EDUCATIONS
   * ---------------------------------------------- */
  async function fetchUserEducations(force = false): Promise<UserEducation[]> {
    // Initialize from IndexedDB first
    await initFromIndexedDB()
    
    // If we have data and not forcing, return immediately
    if (userEducations.value.length > 0 && !force) {
      console.log('📦 Using cached educations from IndexedDB')
      return userEducations.value 
    }

    // Fetch from API
    try {
      loading.value = true
      console.log('🌐 Fetching educations from API...')

      const { data, error } = await apollo.query({
        query: GET_USER_EDUCATIONS,
        fetchPolicy: force ? 'network-only' : 'cache-first'
      })
      
      if (error) {
        console.error('❌ Error fetching user educations:', error)
        main_error.value = { message: error.message || 'Failed to fetch user educations' }
        return []
      }
      
      const educations = data?.userEducations || []
      userEducations.value = educations
      
      // Save to IndexedDB
      if (import.meta.client) {
        try {
          await saveAllEducations(educations)
          console.log(`✅ Fetched and saved ${educations.length} educations`)
        } catch (dbError) {
          console.error('❌ Error saving to IndexedDB:', dbError)
        }
      }
    } catch (err: any) {
      console.error('❌ Error fetching user educations:', err)
      main_error.value = { message: err?.message || 'Failed to fetch user educations' }
      return []
    } finally {
      loading.value = false
    }
    return userEducations.value
  }

  /* ----------------------------------------------
   * CREATE USER EDUCATION
   * ---------------------------------------------- */
  async function createUserEducation(input: UserEducationInput) {
    try {
      loading.value = true
      const result = await apollo.mutate({
        mutation: CREATE_USER_EDUCATION_MUTATION,
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
      
      const newEducation = result.data?.createUserEducation
      if (newEducation) {
        // Create new array to avoid read-only issues
        userEducations.value = [newEducation, ...userEducations.value]
        
        // Save to IndexedDB
        if (import.meta.client) {
          try {
            await saveAllEducations(userEducations.value)
            console.log('✅ New education added')
          } catch (dbError) {
            console.error('❌ Error saving to IndexedDB:', dbError)
          }
        }
      }
      
      return { success: true, education: newEducation }
    } catch (err: any) {
      console.error('Error creating user education:', err)
      main_error.value = { message: err?.message || 'Failed to create education' }
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
      
      const updatedEducation = result.data?.updateUserEducation
      if (updatedEducation) {
        const index = userEducations.value.findIndex(e => e.id === id)
        if (index !== -1) {
          // Create new array to avoid read-only issues
          const newEducations = [...userEducations.value]
          newEducations[index] = updatedEducation
          userEducations.value = newEducations
        }
        
        // Save to IndexedDB
        if (import.meta.client) {
          try {
            await saveAllEducations(userEducations.value)
            console.log('✅ Education updated')
          } catch (dbError) {
            console.error('❌ Error saving to IndexedDB:', dbError)
          }
        }
        return { success: true, education: updatedEducation }
      }
      
      return { success: false, error: 'No data returned from mutation' }
    } catch (err: any) {
      console.error('Error updating user education:', err)
      main_error.value = { message: err?.message || 'Failed to update education' }
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
        variables: { id }
      })
      
      if (result.errors && result.errors.length > 0) {
        const messages = result.errors
          .map((err: any) => err.message)
          .join(' ')
        main_error.value = { message: messages }
        return { success: false, error: messages }
      }
      
      userEducations.value = userEducations.value.filter(e => e.id !== id)
      
      // Save to IndexedDB
      if (import.meta.client) {
        try {
          await saveAllEducations(userEducations.value)
          console.log('✅ Education deleted')
        } catch (dbError) {
          console.error('❌ Error saving to IndexedDB:', dbError)
        }
      }
      
      return { success: true }
    } catch (err: any) {
      console.error('Error deleting user education:', err)
      main_error.value = { message: err?.message || 'Failed to delete education' }
      return { success: false, error: err?.message ?? 'Failed to delete education' }
    } finally {
      loading.value = false
    }
  }

  return {
    userEducations,
    loading,
    main_error,
    isInitialized,
    fetchUserEducations,
    createUserEducation,
    updateUserEducation,
    deleteUserEducation,
    clearUserEducations
  }
})