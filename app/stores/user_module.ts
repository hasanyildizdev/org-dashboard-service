import { defineStore } from 'pinia'
import type { 
  UserModule, 
  UserModuleInput 
} from '~/types/core_types'
import { GET_USER_MODULES } from '~/graphql/queries'
import { 
  CREATE_USER_MODULE_MUTATION,
  UPDATE_USER_MODULE_MUTATION,
  DELETE_USER_MODULE_MUTATION 
} from '~/graphql/mutations'
import { useApolloClient } from '@vue/apollo-composable'
import {
  getAllUserModules,
  saveAllUserModules,
  saveUserModule,
  deleteUserModule as deleteUserModuleFromDB
} from '~/utils/db'

export const useUserModuleStore = defineStore('user_module', () => {
  const apollo = useApolloClient().client
  const loading = ref(false)
  const main_error = ref<{ message: string } | null>(null)
  const isInitialized = ref(false)
  
  // State - IndexedDB only (no cookies, unlimited size)
  const userModules = ref<UserModule[]>([])

  /**
   * Initialize from IndexedDB on first access (client-only)
   */
  async function initFromIndexedDB() {
    if (import.meta.server || isInitialized.value) return
    
    try {
      const cached = await getAllUserModules()
      if (cached.length > 0) {
        // Data from IndexedDB is already plain objects
        userModules.value = cached
        console.log(`⚡ Loaded ${cached.length} user modules from IndexedDB`)
      }
      isInitialized.value = true
    } catch (error) {
      console.error('❌ Error loading from IndexedDB:', error)
      isInitialized.value = true
    }
  }

  /* ----------------------------------------------
   * FETCH USER MODULES
   * ---------------------------------------------- */
  async function fetchUserModules(force = false): Promise<UserModule[]> {
    // Initialize from IndexedDB first
    await initFromIndexedDB()
    
    // If we have data and not forcing, return immediately
    if (userModules.value.length > 0 && !force) {
      console.log('📦 Using cached user modules from IndexedDB')
      return userModules.value 
    }

    // Fetch from API
    try {
      loading.value = true
      console.log('🌐 Fetching user modules from API...')

      const { data, error } = await apollo.query({
        query: GET_USER_MODULES,
        fetchPolicy: force ? 'network-only' : 'cache-first'
      })
      
      if (error) {
        console.error('❌ Error fetching user modules:', error)
        main_error.value = { message: error.message || 'Failed to fetch user modules' }
        return []
      }
      
      const modules = data?.userModules || []
      userModules.value = modules
      
      // Save to IndexedDB (convert to plain objects)
      if (import.meta.client) {
        try {
          const plainModules = JSON.parse(JSON.stringify(modules))
          await saveAllUserModules(plainModules)
          console.log(`✅ Fetched and saved ${modules.length} user modules`)
        } catch (dbError) {
          console.error('❌ Error saving to IndexedDB:', dbError)
        }
      }
      
      return modules
    } catch (err: any) {
      console.error('❌ Error fetching user modules:', err)
      main_error.value = { message: err?.message || 'Failed to fetch user modules' }
      return []
    } finally {
      loading.value = false
    }
  }

  /* ----------------------------------------------
   * CREATE USER MODULE
   * ---------------------------------------------- */
  async function createUserModule(input: UserModuleInput) {
    try {
      loading.value = true
      const result = await apollo.mutate({
        mutation: CREATE_USER_MODULE_MUTATION,
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

      const newModule = result.data?.createUserModule
      if (newModule) {
        // Create new array to avoid read-only issues
        userModules.value = [newModule, ...userModules.value]
        
        // Save to IndexedDB (convert to plain objects)
        if (import.meta.client) {
          try {
            const plainModules = JSON.parse(JSON.stringify(userModules.value))
            await saveAllUserModules(plainModules)
            console.log('✅ User module created and saved to IndexedDB')
          } catch (dbError) {
            console.error('❌ Error saving to IndexedDB:', dbError)
          }
        }
        
        return { success: true, module: newModule }
      }
      
      return { success: false, error: 'No data returned from mutation' }
    } catch (err: any) {
      console.error('❌ Error creating user module:', err)
      main_error.value = { message: err?.message || 'Failed to create user module' }
      return { success: false, error: err?.message ?? 'Failed to create user module' }
    } finally {
      loading.value = false
    }
  }

  /* ----------------------------------------------
   * UPDATE USER MODULE
   * ---------------------------------------------- */
  async function updateUserModule(id: string, input: UserModuleInput) {
    try {
      loading.value = true
      const result = await apollo.mutate({
        mutation: UPDATE_USER_MODULE_MUTATION,
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

      const updatedModule = result.data?.updateUserModule
      if (!updatedModule) {
        main_error.value = { message: 'No data returned from mutation' }
        return { success: false, error: 'No data returned from mutation' }
      }
      
      const index = userModules.value.findIndex(module => module.id === id)
      if (index !== -1) {
        // Create new array to avoid read-only issues
        const newModules = [...userModules.value]
        newModules[index] = updatedModule
        userModules.value = newModules
      }
      
      // Save to IndexedDB (convert to plain objects)
      if (import.meta.client) {
        try {
          const plainModules = JSON.parse(JSON.stringify(userModules.value))
          await saveAllUserModules(plainModules)
          console.log('✅ User module updated and saved to IndexedDB')
        } catch (dbError) {
          console.error('❌ Error saving to IndexedDB:', dbError)
        }
      }
      
      return { success: true, module: updatedModule }
    } catch (err: any) {
      console.error('❌ Error updating user module:', err)
      main_error.value = { message: err?.message || 'Failed to update user module' }
      return { success: false, error: err?.message ?? 'Failed to update user module' }
    } finally {
      loading.value = false
    }
  }

  /* ----------------------------------------------
   * DELETE USER MODULE
   * ---------------------------------------------- */
  async function deleteUserModule(id: string) {
    try {
      loading.value = true
      const result = await apollo.mutate({
        mutation: DELETE_USER_MODULE_MUTATION,
        variables: { id }
      })
      
      if (result.errors && result.errors.length > 0) {
        const messages = result.errors.map((err: any) => err.message).join(' ')
        main_error.value = { message: messages }
        return { success: false, error: messages }
      }

      if (result.data?.deleteUserModule) {
        userModules.value = userModules.value.filter(module => module.id !== id)
        
        // Delete from IndexedDB
        if (import.meta.client) {
          try {
            await deleteUserModuleFromDB(id)
            console.log('✅ User module deleted from IndexedDB')
          } catch (dbError) {
            console.error('❌ Error deleting from IndexedDB:', dbError)
          }
        }
        
        return { success: true }
      }
      
      return { success: false, error: 'Failed to delete user module' }
    } catch (err: any) {
      console.error('❌ Error deleting user module:', err)
      main_error.value = { message: err?.message || 'Failed to delete user module' }
      return { success: false, error: err?.message ?? 'Failed to delete user module' }
    } finally {
      loading.value = false
    }
  }

  /* ----------------------------------------------
   * TOGGLE USER MODULE (shorthand for enable/disable)
   * ---------------------------------------------- */
  async function toggleUserModule(id: string, moduleId: string, currentState: boolean) {
    return await updateUserModule(id, {
      module_id: moduleId,
      is_enabled: !currentState
    })
  }

  /* ----------------------------------------------
   * CLEAR USER MODULES
   * ---------------------------------------------- */
  async function clearUserModules() {
    userModules.value = []
    isInitialized.value = false
    main_error.value = null
    
    if (import.meta.server) return
    
    try {
      await saveAllUserModules([])
      console.log('🗑️ User modules cleared from IndexedDB')
    } catch (error) {
      console.error('❌ Error clearing user modules:', error)
    }
  }

  return {
    userModules,
    loading,
    main_error,
    isInitialized,
    fetchUserModules,
    createUserModule,
    updateUserModule,
    deleteUserModule,
    toggleUserModule,
    clearUserModules
  }
})
