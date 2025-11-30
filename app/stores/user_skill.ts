import { defineStore } from 'pinia'
import type { 
  UserSkill, 
  UserSkillInput 
} from '~/types/core_types'
import { GET_USER_SKILLS } from '~/graphql/queries'
import { 
  CREATE_USER_SKILL_MUTATION,
  UPDATE_USER_SKILL_MUTATION,
  DELETE_USER_SKILL_MUTATION 
} from '~/graphql/mutations'
import { useApolloClient } from '@vue/apollo-composable'
import {
  getAllSkills,
  saveAllSkills,
  saveSkill,
  deleteSkill as deleteSkillFromDB
} from '~/utils/db'

export const useUserSkillStore = defineStore('user_skill', () => {
  const apollo = useApolloClient().client
  const loading = ref(false)
  const main_error = ref<{ message: string } | null>(null)
  const isInitialized = ref(false)
  
  // State - IndexedDB only (no cookies, unlimited size)
  const userSkills = ref<UserSkill[]>([])

  /**
   * Initialize from IndexedDB on first access (client-only)
   */
  async function initFromIndexedDB() {
    if (import.meta.server || isInitialized.value) return
    
    try {
      const cached = await getAllSkills()
      if (cached.length > 0) {
        userSkills.value = cached
      }
      isInitialized.value = true
    } catch (error) {
      console.error('❌ Error loading from IndexedDB:', error)
      isInitialized.value = true
    }
  }

  /* ----------------------------------------------
   * FETCH USER SKILLS
   * ---------------------------------------------- */
  async function fetchUserSkills(force = false): Promise<UserSkill[]> {
    // Initialize from IndexedDB first
    await initFromIndexedDB()
    
    // If we have data and not forcing, return immediately
    if (userSkills.value.length > 0 && !force) {
      return userSkills.value 
    }

    // Fetch from API
    try {
      loading.value = true

      const { data, error } = await apollo.query({
        query: GET_USER_SKILLS,
        fetchPolicy: force ? 'network-only' : 'cache-first'
      })
      
      if (error) {
        console.error('❌ Error fetching user skills:', error)
        main_error.value = { message: error.message || 'Failed to fetch user skills' }
        return []
      }
      
      const skills = data?.userSkills || []
      userSkills.value = skills
      
      // Save to IndexedDB
      if (import.meta.client) {
        try {
          await saveAllSkills(skills)
        } catch (dbError) {
          console.error('❌ Error saving to IndexedDB:', dbError)
        }
      }
      
      return skills
    } catch (err: any) {
      console.error('❌ Error fetching user skills:', err)
      main_error.value = { message: err?.message || 'Failed to fetch user skills' }
      return []
    } finally {
      loading.value = false
    }
  }

  /* ----------------------------------------------
   * CREATE USER SKILL
   * ---------------------------------------------- */
  async function createUserSkill(input: UserSkillInput) {
    try {
      loading.value = true
      const result = await apollo.mutate({
        mutation: CREATE_USER_SKILL_MUTATION,
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

      const newSkill = result.data?.createUserSkill
      if (newSkill) {
        // Create new array to avoid read-only issues
        userSkills.value = [newSkill, ...userSkills.value]
        
        // Save to IndexedDB
        if (import.meta.client) {
          try {
            await saveAllSkills(userSkills.value)
          } catch (dbError) {
            console.error('❌ Error saving to IndexedDB:', dbError)
          }
        }
        
        return { success: true, skill: newSkill }
      }
      
      return { success: false, error: 'No data returned from mutation' }
    } catch (err: any) {
      console.error('❌ Error creating skill:', err)
      main_error.value = { message: err?.message || 'Failed to create skill' }
      return { success: false, error: err?.message ?? 'Failed to create skill' }
    } finally {
      loading.value = false
    }
  }

  /* ----------------------------------------------
   * UPDATE USER SKILL
   * ---------------------------------------------- */
  async function updateUserSkill(id: string, input: UserSkillInput) {
    try {
      loading.value = true
      const result = await apollo.mutate({
        mutation: UPDATE_USER_SKILL_MUTATION,
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

      const updatedSkill = result.data?.updateUserSkill
      if (!updatedSkill) {
        main_error.value = { message: 'No data returned from mutation' }
        return { success: false, error: 'No data returned from mutation' }
      }
      
      const index = userSkills.value.findIndex(skill => skill.id === id)
      if (index !== -1) {
        // Create new array to avoid read-only issues
        const newSkills = [...userSkills.value]
        newSkills[index] = updatedSkill
        userSkills.value = newSkills
      }
      
      // Save to IndexedDB
      if (import.meta.client) {
        try {
          await saveAllSkills(userSkills.value)
        } catch (dbError) {
          console.error('❌ Error saving to IndexedDB:', dbError)
        }
      }
      
      return { success: true, skill: updatedSkill }
    } catch (err: any) {
      console.error('❌ Error updating skill:', err)
      main_error.value = { message: err?.message || 'Failed to update skill' }
      return { success: false, error: err?.message ?? 'Failed to update skill' }
    } finally {
      loading.value = false
    }
  }

  /* ----------------------------------------------
   * DELETE USER SKILL
   * ---------------------------------------------- */
  async function deleteUserSkill(id: string) {
    try {
      loading.value = true
      const result = await apollo.mutate({
        mutation: DELETE_USER_SKILL_MUTATION,
        variables: { id }
      })
      
      if (result.errors && result.errors.length > 0) {
        const messages = result.errors.map((err: any) => err.message).join(' ')
        main_error.value = { message: messages }
        return { success: false, error: messages }
      }

      if (result.data?.deleteUserSkill) {
        userSkills.value = userSkills.value.filter(skill => skill.id !== id)
        
        // Delete from IndexedDB
        if (import.meta.client) {
          try {
            await deleteSkillFromDB(id)
          } catch (dbError) {
            console.error('❌ Error deleting from IndexedDB:', dbError)
          }
        }
        
        return { success: true }
      }
      
      return { success: false, error: 'Failed to delete skill' }
    } catch (err: any) {
      console.error('❌ Error deleting skill:', err)
      main_error.value = { message: err?.message || 'Failed to delete skill' }
      return { success: false, error: err?.message ?? 'Failed to delete skill' }
    } finally {
      loading.value = false
    }
  }

  /* ----------------------------------------------
   * CLEAR USER SKILLS
   * ---------------------------------------------- */
  async function clearUserSkills() {
    userSkills.value = []
    isInitialized.value = false
    main_error.value = null
    
    if (import.meta.server) return
    
    try {
      await saveAllSkills([])
    } catch (error) {
      console.error('❌ Error clearing skills:', error)
    }
  }

  return {
    userSkills,
    loading,
    main_error,
    isInitialized,
    fetchUserSkills,
    createUserSkill,
    updateUserSkill,
    deleteUserSkill,
    clearUserSkills
  }
})
