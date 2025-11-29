import { defineStore } from 'pinia'
import type { Organization, OrganizationInput } from '~/types/core_types'
import { GET_ORGANIZATIONS } from '~/graphql/queries'
import { CREATE_ORGANIZATION_MUTATION, UPDATE_ORGANIZATION_MUTATION, DELETE_ORGANIZATION_MUTATION } from '~/graphql/mutations'
import { useApolloClient } from '@vue/apollo-composable'
import { saveAllOrganizations, saveOrganization as saveOrgToIDB, deleteOrganization as deleteOrgFromIDB, getAllOrganizations } from '~/utils/db'

export const useOrganizationStore = defineStore('organization', () => {
  const apollo = useApolloClient().client
  const organizations = ref<Organization[]>([])
  const loading = ref(false)
  const main_error = ref<{ message: string } | null>(null)
  const isInitialized = ref(false)

  /**
   * Initialize from IndexedDB on first access (client-only)
   */
  async function initFromIndexedDB() {
    if (import.meta.server || isInitialized.value) return
    
    try {
      const cached = await getAllOrganizations()
      if (cached.length > 0) {
        organizations.value = cached
        console.log(`⚡ Loaded ${cached.length} organizations from IndexedDB`)
      }
      isInitialized.value = true
    } catch (error) {
      console.error('❌ Error loading from IndexedDB:', error)
      isInitialized.value = true
    }
  }

  /**
   * Fetch all organizations from GraphQL API and sync to IndexedDB
   */
  async function fetchOrganizations(force = false): Promise<Organization[]> {
    // Initialize from IndexedDB first
    await initFromIndexedDB()
    
    // If we have data and not forcing, return immediately
    if (organizations.value.length > 0 && !force) {
      console.log('📦 Using cached organizations from IndexedDB')
      return organizations.value
    }

    // Fetch from API
    try {
      loading.value = true
      console.log('🌐 Fetching organizations from API...')

      const { data, error } = await apollo.query({
        query: GET_ORGANIZATIONS,
        fetchPolicy: force ? 'network-only' : 'cache-first'
      })
      
      if (error) {
        console.error('❌ Error fetching organizations:', error)
        main_error.value = { message: error.message || 'Failed to fetch organizations' }
        return []
      }
      
      const orgs = data?.organizations || []
      organizations.value = orgs
      
      // Save to IndexedDB
      if (import.meta.client) {
        try {
          await saveAllOrganizations(orgs)
          console.log(`✅ Fetched and saved ${orgs.length} organizations`)
        } catch (dbError) {
          console.error('❌ Error saving to IndexedDB:', dbError)
        }
      }
      
      return orgs
    } catch (err: any) {
      console.error('❌ Error fetching organizations:', err)
      main_error.value = { message: err?.message || 'Failed to fetch organizations' }
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * Create a new organization
   */
  async function createOrganization(input: OrganizationInput): Promise<{ success: boolean; data?: Organization; error?: string }> {
    loading.value = true
    main_error.value = null

    try {
      const { data, errors } = await apollo.mutate({
        mutation: CREATE_ORGANIZATION_MUTATION,
        variables: { input }
      })

      if (errors || !data) {
        throw new Error(errors?.[0]?.message || 'Failed to create organization')
      }

      const newOrg = data.createOrganization
      organizations.value.push(newOrg)
      
      // Save to IndexedDB
      if (import.meta.client) {
        await saveOrgToIDB(newOrg)
      }

      return { success: true, data: newOrg }
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to create organization'
      main_error.value = { message: errorMsg }
      console.error('Error creating organization:', err)
      return { success: false, error: errorMsg }
    } finally {
      loading.value = false
    }
  }

  /**
   * Update an existing organization
   */
  async function updateOrganization(id: string, input: OrganizationInput): Promise<{ success: boolean; data?: Organization; error?: string }> {
    loading.value = true
    main_error.value = null

    try {
      const { data, errors } = await apollo.mutate({
        mutation: UPDATE_ORGANIZATION_MUTATION,
        variables: { id, input }
      })

      if (errors || !data) {
        throw new Error(errors?.[0]?.message || 'Failed to update organization')
      }

      const updatedOrg = data.updateOrganization
      const index = organizations.value.findIndex(o => o.id === id)
      if (index !== -1) {
        organizations.value[index] = updatedOrg
      }
      
      // Update in IndexedDB
      if (import.meta.client) {
        await saveOrgToIDB(updatedOrg)
      }

      return { success: true, data: updatedOrg }
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to update organization'
      main_error.value = { message: errorMsg }
      console.error('Error updating organization:', err)
      return { success: false, error: errorMsg }
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete an organization
   */
  async function deleteOrganization(id: string): Promise<{ success: boolean; error?: string }> {
    loading.value = true
    main_error.value = null

    try {
      const { data, errors } = await apollo.mutate({
        mutation: DELETE_ORGANIZATION_MUTATION,
        variables: { id }
      })

      if (errors || !data?.deleteOrganization) {
        throw new Error(errors?.[0]?.message || 'Failed to delete organization')
      }

      organizations.value = organizations.value.filter(o => o.id !== id)
      
      // Delete from IndexedDB
      if (import.meta.client) {
        await deleteOrgFromIDB(id)
      }

      return { success: true }
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to delete organization'
      main_error.value = { message: errorMsg }
      console.error('Error deleting organization:', err)
      return { success: false, error: errorMsg }
    } finally {
      loading.value = false
    }
  }

  /**
   * Get organization by ID
   */
  function getOrganizationById(id: string): Organization | undefined {
    return organizations.value.find(o => o.id === id)
  }

  return {
    organizations,
    loading,
    main_error,
    fetchOrganizations,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    getOrganizationById
  }
})
