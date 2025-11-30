import { defineStore } from 'pinia'
import type { 
  UserSocialAccount, 
  UserSocialAccountInput 
} from '~/types/core_types'
import { GET_USER_SOCIAL_ACCOUNTS } from '~/graphql/queries'
import { 
  CREATE_USER_SOCIAL_ACCOUNT_MUTATION,
  UPDATE_USER_SOCIAL_ACCOUNT_MUTATION,
  DELETE_USER_SOCIAL_ACCOUNT_MUTATION 
} from '~/graphql/mutations'
import { useApolloClient } from '@vue/apollo-composable'
import {
  getAllSocialAccounts,
  saveAllSocialAccounts,
  saveSocialAccount,
  deleteSocialAccount as deleteSocialAccountFromDB
} from '~/utils/db'

export const useUserSocialAccountStore = defineStore('user_social_account', () => {
  const apollo = useApolloClient().client
  const loading = ref(false)
  const main_error = ref<{ message: string } | null>(null)
  const isInitialized = ref(false)
  
  // State - IndexedDB only (no cookies, unlimited size)
  const userSocialAccounts = ref<UserSocialAccount[]>([])

  /**
   * Initialize from IndexedDB on first access (client-only)
   */
  async function initFromIndexedDB() {
    if (import.meta.server || isInitialized.value) return
    
    try {
      const cached = await getAllSocialAccounts()
      if (cached.length > 0) {
        userSocialAccounts.value = cached
      }
      isInitialized.value = true
    } catch (error) {
      console.error('❌ Error loading from IndexedDB:', error)
      isInitialized.value = true
    }
  }

  /* ----------------------------------------------
   * FETCH USER SOCIAL ACCOUNTS
   * ---------------------------------------------- */
  async function fetchUserSocialAccounts(force = false): Promise<UserSocialAccount[]> {
    // Initialize from IndexedDB first
    await initFromIndexedDB()
    
    // If we have data and not forcing, return immediately
    if (userSocialAccounts.value.length > 0 && !force) {
      return userSocialAccounts.value 
    }

    // Fetch from API
    try {
      loading.value = true

      const { data, error } = await apollo.query({
        query: GET_USER_SOCIAL_ACCOUNTS,
        fetchPolicy: force ? 'network-only' : 'cache-first'
      })
      
      if (error) {
        console.error('❌ Error fetching user social accounts:', error)
        main_error.value = { message: error.message || 'Failed to fetch user social accounts' }
        return []
      }
      
      const accounts = data?.userSocialAccounts || []
      userSocialAccounts.value = accounts
      
      // Save to IndexedDB
      if (import.meta.client) {
        try {
          await saveAllSocialAccounts(accounts)
        } catch (dbError) {
          console.error('❌ Error saving to IndexedDB:', dbError)
        }
      }
      
      return accounts
    } catch (err: any) {
      console.error('❌ Error fetching user social accounts:', err)
      main_error.value = { message: err?.message || 'Failed to fetch user social accounts' }
      return []
    } finally {
      loading.value = false
    }
  }

  /* ----------------------------------------------
   * CREATE USER SOCIAL ACCOUNT
   * ---------------------------------------------- */
  async function createUserSocialAccount(input: UserSocialAccountInput) {
    try {
      loading.value = true
      const result = await apollo.mutate({
        mutation: CREATE_USER_SOCIAL_ACCOUNT_MUTATION,
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

      const newAccount = result.data?.createUserSocialAccount
      if (newAccount) {
        // Create new array to avoid read-only issues
        userSocialAccounts.value = [newAccount, ...userSocialAccounts.value]
        
        // Save to IndexedDB
        if (import.meta.client) {
          try {
            await saveAllSocialAccounts(userSocialAccounts.value)
          } catch (dbError) {
            console.error('❌ Error saving to IndexedDB:', dbError)
          }
        }
        
        return { success: true, account: newAccount }
      }
      
      return { success: false, error: 'No data returned from mutation' }
    } catch (err: any) {
      console.error('❌ Error creating social account:', err)
      main_error.value = { message: err?.message || 'Failed to create social account' }
      return { success: false, error: err?.message ?? 'Failed to create social account' }
    } finally {
      loading.value = false
    }
  }

  /* ----------------------------------------------
   * UPDATE USER SOCIAL ACCOUNT
   * ---------------------------------------------- */
  async function updateUserSocialAccount(id: string, input: UserSocialAccountInput) {
    try {
      loading.value = true
      const result = await apollo.mutate({
        mutation: UPDATE_USER_SOCIAL_ACCOUNT_MUTATION,
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

      const updatedAccount = result.data?.updateUserSocialAccount
      if (!updatedAccount) {
        main_error.value = { message: 'No data returned from mutation' }
        return { success: false, error: 'No data returned from mutation' }
      }
      
      const index = userSocialAccounts.value.findIndex(account => account.id === id)
      if (index !== -1) {
        // Create new array to avoid read-only issues
        const newAccounts = [...userSocialAccounts.value]
        newAccounts[index] = updatedAccount
        userSocialAccounts.value = newAccounts
      }
      
      // Save to IndexedDB
      if (import.meta.client) {
        try {
          await saveAllSocialAccounts(userSocialAccounts.value)
        } catch (dbError) {
          console.error('❌ Error saving to IndexedDB:', dbError)
        }
      }
      
      return { success: true, account: updatedAccount }
    } catch (err: any) {
      console.error('❌ Error updating social account:', err)
      main_error.value = { message: err?.message || 'Failed to update social account' }
      return { success: false, error: err?.message ?? 'Failed to update social account' }
    } finally {
      loading.value = false
    }
  }

  /* ----------------------------------------------
   * DELETE USER SOCIAL ACCOUNT
   * ---------------------------------------------- */
  async function deleteUserSocialAccount(id: string) {
    try {
      loading.value = true
      const result = await apollo.mutate({
        mutation: DELETE_USER_SOCIAL_ACCOUNT_MUTATION,
        variables: { id }
      })
      
      if (result.errors && result.errors.length > 0) {
        const messages = result.errors.map((err: any) => err.message).join(' ')
        main_error.value = { message: messages }
        return { success: false, error: messages }
      }

      if (result.data?.deleteUserSocialAccount) {
        userSocialAccounts.value = userSocialAccounts.value.filter(account => account.id !== id)
        
        // Delete from IndexedDB
        if (import.meta.client) {
          try {
            await deleteSocialAccountFromDB(id)
          } catch (dbError) {
            console.error('❌ Error deleting from IndexedDB:', dbError)
          }
        }
        
        return { success: true }
      }
      
      return { success: false, error: 'Failed to delete social account' }
    } catch (err: any) {
      console.error('❌ Error deleting social account:', err)
      main_error.value = { message: err?.message || 'Failed to delete social account' }
      return { success: false, error: err?.message ?? 'Failed to delete social account' }
    } finally {
      loading.value = false
    }
  }

  /* ----------------------------------------------
   * CLEAR USER SOCIAL ACCOUNTS
   * ---------------------------------------------- */
  async function clearUserSocialAccounts() {
    userSocialAccounts.value = []
    isInitialized.value = false
    main_error.value = null
    
    if (import.meta.server) return
    
    try {
      await saveAllSocialAccounts([])
    } catch (error) {
      console.error('❌ Error clearing social accounts:', error)
    }
  }

  return {
    userSocialAccounts,
    loading,
    main_error,
    isInitialized,
    fetchUserSocialAccounts,
    createUserSocialAccount,
    updateUserSocialAccount,
    deleteUserSocialAccount,
    clearUserSocialAccounts
  }
})
