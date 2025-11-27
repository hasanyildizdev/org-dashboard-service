import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { UserEducation } from '~/types/core_types'

// Define the database schema
interface AppDB extends DBSchema {
  userEducations: {
    key: string
    value: UserEducation
    indexes: {
      'by-user': string
      'by-current': number
    }
  }
  // You can add more stores for skills, experiences, etc.
  // userSkills: { ... }
  // userExperiences: { ... }
}

const DB_NAME = 'ourganize-app-db'
const DB_VERSION = 2 // Increased to force schema recreation

let dbInstance: IDBPDatabase<AppDB> | null = null

/**
 * Initialize and get the IndexedDB instance
 */
export async function getDB(): Promise<IDBPDatabase<AppDB>> {
  if (dbInstance) {
    return dbInstance
  }

  try {
    dbInstance = await openDB<AppDB>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        console.log(`📊 Upgrading IndexedDB from v${oldVersion} to v${newVersion}`)
        
        // Delete old stores if they exist (clean slate)
        if (db.objectStoreNames.contains('userEducations')) {
          db.deleteObjectStore('userEducations')
        }
        
        // Create user educations store
        const educationStore = db.createObjectStore('userEducations', {
          keyPath: 'id'
        })
        
        // Create indexes for efficient querying
        educationStore.createIndex('by-user', 'user_id')
        educationStore.createIndex('by-current', 'is_current')
        
        console.log('✅ IndexedDB schema created successfully')
      },
    })

    return dbInstance
  } catch (error) {
    console.error('❌ Failed to initialize IndexedDB:', error)
    // Clear dbInstance so next call will retry
    dbInstance = null
    throw error
  }
}

/**
 * Clear all data from IndexedDB (useful on logout)
 */
export async function clearAllData(): Promise<void> {
  const db = await getDB()
  const tx = db.transaction(['userEducations'], 'readwrite')
  
  await Promise.all([
    tx.objectStore('userEducations').clear(),
    tx.done
  ])
  
  console.log('🗑️ IndexedDB cleared')
}

/**
 * Close the database connection
 */
export function closeDB(): void {
  if (dbInstance) {
    dbInstance.close()
    dbInstance = null
    console.log('🔒 IndexedDB connection closed')
  }
}

// ==========================================
// USER EDUCATION OPERATIONS
// ==========================================

/**
 * Get all user educations from IndexedDB
 */
export async function getAllEducations(): Promise<UserEducation[]> {
  try {
    const db = await getDB()
    const educations = await db.getAll('userEducations')
    console.log(`📚 Retrieved ${educations.length} educations from IndexedDB`)
    return educations
  } catch (error) {
    console.error('❌ Error getting educations from IndexedDB:', error)
    return []
  }
}

/**
 * Get a single education by ID
 */
export async function getEducationById(id: string): Promise<UserEducation | undefined> {
  try {
    const db = await getDB()
    return await db.get('userEducations', id)
  } catch (error) {
    console.error('❌ Error getting education by ID:', error)
    return undefined
  }
}

/**
 * Save all educations to IndexedDB (bulk operation)
 */
export async function saveAllEducations(educations: UserEducation[]): Promise<void> {
  try {
    const db = await getDB()
    const tx = db.transaction('userEducations', 'readwrite')
    const store = tx.objectStore('userEducations')
    
    // Clear existing data first
    await store.clear()
    
    // Add all educations
    await Promise.all(
      educations.map(education => store.put(education))
    )
    
    await tx.done
    console.log(`✅ Saved ${educations.length} educations to IndexedDB`)
  } catch (error) {
    console.error('❌ Error saving educations to IndexedDB:', error)
    throw error
  }
}

/**
 * Add or update a single education
 */
export async function saveEducation(education: UserEducation): Promise<void> {
  try {
    const db = await getDB()
    await db.put('userEducations', education)
    console.log(`✅ Saved education "${education.institution}" to IndexedDB`)
  } catch (error) {
    console.error('❌ Error saving education to IndexedDB:', error)
    throw error
  }
}

/**
 * Delete an education by ID
 */
export async function deleteEducation(id: string): Promise<void> {
  try {
    const db = await getDB()
    await db.delete('userEducations', id)
    console.log(`🗑️ Deleted education ${id} from IndexedDB`)
  } catch (error) {
    console.error('❌ Error deleting education from IndexedDB:', error)
    throw error
  }
}

/**
 * Get educations by user ID (using index)
 */
export async function getEducationsByUserId(userId: string): Promise<UserEducation[]> {
  try {
    const db = await getDB()
    return await db.getAllFromIndex('userEducations', 'by-user', userId)
  } catch (error) {
    console.error('❌ Error getting educations by user ID:', error)
    return []
  }
}

/**
 * Get current educations (using index)
 */
export async function getCurrentEducations(): Promise<UserEducation[]> {
  try {
    const db = await getDB()
    return await db.getAllFromIndex('userEducations', 'by-current', 1)
  } catch (error) {
    console.error('❌ Error getting current educations:', error)
    return []
  }
}
