import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { UserEducation, UserExperience, UserSkill } from '~/types/core_types'

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
  userExperiences: {
    key: string
    value: UserExperience
    indexes: {
      'by-user': string
      'by-current': number
    }
  }
  userSkills: {
    key: string
    value: UserSkill
    indexes: {
      'by-user': string
      'by-primary': number
    }
  }
}

const DB_NAME = 'ourganize-app-db'
const DB_VERSION = 4 // Increased to add userSkills store

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
        if (db.objectStoreNames.contains('userExperiences')) {
          db.deleteObjectStore('userExperiences')
        }
        if (db.objectStoreNames.contains('userSkills')) {
          db.deleteObjectStore('userSkills')
        }
        
        // Create user educations store
        const educationStore = db.createObjectStore('userEducations', {
          keyPath: 'id'
        })
        
        // Create indexes for efficient querying
        educationStore.createIndex('by-user', 'user_id')
        educationStore.createIndex('by-current', 'is_current')
        
        // Create user experiences store
        const experienceStore = db.createObjectStore('userExperiences', {
          keyPath: 'id'
        })
        
        // Create indexes for efficient querying
        experienceStore.createIndex('by-user', 'user_id')
        experienceStore.createIndex('by-current', 'is_current')
        
        // Create user skills store
        const skillStore = db.createObjectStore('userSkills', {
          keyPath: 'id'
        })
        
        // Create indexes for efficient querying
        skillStore.createIndex('by-user', 'user_id')
        skillStore.createIndex('by-primary', 'is_primary')
        
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
  const tx = db.transaction(['userEducations', 'userExperiences', 'userSkills'], 'readwrite')
  
  await Promise.all([
    tx.objectStore('userEducations').clear(),
    tx.objectStore('userExperiences').clear(),
    tx.objectStore('userSkills').clear(),
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

// ==========================================
// USER EXPERIENCE OPERATIONS
// ==========================================

/**
 * Get all user experiences from IndexedDB
 */
export async function getAllExperiences(): Promise<UserExperience[]> {
  try {
    const db = await getDB()
    const experiences = await db.getAll('userExperiences')
    console.log(`💼 Retrieved ${experiences.length} experiences from IndexedDB`)
    return experiences
  } catch (error) {
    console.error('❌ Error getting experiences from IndexedDB:', error)
    return []
  }
}

/**
 * Get a single experience by ID
 */
export async function getExperienceById(id: string): Promise<UserExperience | undefined> {
  try {
    const db = await getDB()
    return await db.get('userExperiences', id)
  } catch (error) {
    console.error('❌ Error getting experience by ID:', error)
    return undefined
  }
}

/**
 * Save all experiences to IndexedDB (bulk operation)
 */
export async function saveAllExperiences(experiences: UserExperience[]): Promise<void> {
  try {
    const db = await getDB()
    const tx = db.transaction('userExperiences', 'readwrite')
    const store = tx.objectStore('userExperiences')
    
    // Clear existing data first
    await store.clear()
    
    // Add all experiences
    await Promise.all(
      experiences.map(experience => store.put(experience))
    )
    
    await tx.done
    console.log(`✅ Saved ${experiences.length} experiences to IndexedDB`)
  } catch (error) {
    console.error('❌ Error saving experiences to IndexedDB:', error)
    throw error
  }
}

/**
 * Add or update a single experience
 */
export async function saveExperience(experience: UserExperience): Promise<void> {
  try {
    const db = await getDB()
    await db.put('userExperiences', experience)
    console.log(`✅ Saved experience "${experience.company}" to IndexedDB`)
  } catch (error) {
    console.error('❌ Error saving experience to IndexedDB:', error)
    throw error
  }
}

/**
 * Delete an experience by ID
 */
export async function deleteExperience(id: string): Promise<void> {
  try {
    const db = await getDB()
    await db.delete('userExperiences', id)
    console.log(`🗑️ Deleted experience ${id} from IndexedDB`)
  } catch (error) {
    console.error('❌ Error deleting experience from IndexedDB:', error)
    throw error
  }
}

/**
 * Get experiences by user ID (using index)
 */
export async function getExperiencesByUserId(userId: string): Promise<UserExperience[]> {
  try {
    const db = await getDB()
    return await db.getAllFromIndex('userExperiences', 'by-user', userId)
  } catch (error) {
    console.error('❌ Error getting experiences by user ID:', error)
    return []
  }
}

/**
 * Get current experiences (using index)
 */
export async function getCurrentExperiences(): Promise<UserExperience[]> {
  try {
    const db = await getDB()
    return await db.getAllFromIndex('userExperiences', 'by-current', 1)
  } catch (error) {
    console.error('❌ Error getting current experiences:', error)
    return []
  }
}

/* ============================================
 * USER SKILLS FUNCTIONS
 * ============================================ */

/**
 * Get all skills from IndexedDB
 */
export async function getAllSkills(): Promise<UserSkill[]> {
  try {
    const db = await getDB()
    return await db.getAll('userSkills')
  } catch (error) {
    console.error('❌ Error getting all skills from IndexedDB:', error)
    return []
  }
}

/**
 * Get skill by ID
 */
export async function getSkillById(id: string): Promise<UserSkill | undefined> {
  try {
    const db = await getDB()
    return await db.get('userSkills', id)
  } catch (error) {
    console.error('❌ Error getting skill by ID:', error)
    return undefined
  }
}

/**
 * Save all skills (replaces existing data)
 */
export async function saveAllSkills(skills: UserSkill[]): Promise<void> {
  try {
    const db = await getDB()
    const tx = db.transaction('userSkills', 'readwrite')
    
    // Clear existing data
    await tx.objectStore('userSkills').clear()
    
    // Add all skills
    for (const skill of skills) {
      await tx.objectStore('userSkills').put(skill)
    }
    
    await tx.done
  } catch (error) {
    console.error('❌ Error saving skills to IndexedDB:', error)
    throw error
  }
}

/**
 * Save single skill (create or update)
 */
export async function saveSkill(skill: UserSkill): Promise<void> {
  try {
    const db = await getDB()
    await db.put('userSkills', skill)
  } catch (error) {
    console.error('❌ Error saving skill to IndexedDB:', error)
    throw error
  }
}

/**
 * Delete skill by ID
 */
export async function deleteSkill(id: string): Promise<void> {
  try {
    const db = await getDB()
    await db.delete('userSkills', id)
  } catch (error) {
    console.error('❌ Error deleting skill from IndexedDB:', error)
    throw error
  }
}

/**
 * Get skills by user ID (using index)
 */
export async function getSkillsByUserId(userId: string): Promise<UserSkill[]> {
  try {
    const db = await getDB()
    return await db.getAllFromIndex('userSkills', 'by-user', userId)
  } catch (error) {
    console.error('❌ Error getting skills by user ID:', error)
    return []
  }
}

/**
 * Get primary skills (using index)
 */
export async function getPrimarySkills(): Promise<UserSkill[]> {
  try {
    const db = await getDB()
    return await db.getAllFromIndex('userSkills', 'by-primary', 1)
  } catch (error) {
    console.error('❌ Error getting primary skills:', error)
    return []
  }
}
