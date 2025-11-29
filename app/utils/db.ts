import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { UserEducation, UserExperience, UserSkill, UserSocialAccount, Organization, Workspace, Project, ProjectDetail } from '~/types/core_types'

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
  userSocialAccounts: {
    key: string
    value: UserSocialAccount
    indexes: {
      'by-user': string
      'by-provider': string
    }
  }
  organizations: {
    key: string
    value: Organization
    indexes: {
      'by-user': string
      'by-slug': string
    }
  }
  workspaces: {
    key: string
    value: Workspace
    indexes: {
      'by-organization': string
    }
  }
  projects: {
    key: string
    value: Project
    indexes: {
      'by-workspace': string
      'by-status': string
      'by-featured': number
    }
  }
  projectDetails: {
    key: string
    value: ProjectDetail
    indexes: {
      'by-project': string
    }
  }
}

const DB_NAME = 'ourganize-app-db'
const DB_VERSION = 6 // Increased to add PMS stores

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
        if (db.objectStoreNames.contains('userSocialAccounts')) {
          db.deleteObjectStore('userSocialAccounts')
        }
        if (db.objectStoreNames.contains('organizations')) {
          db.deleteObjectStore('organizations')
        }
        if (db.objectStoreNames.contains('workspaces')) {
          db.deleteObjectStore('workspaces')
        }
        if (db.objectStoreNames.contains('projects')) {
          db.deleteObjectStore('projects')
        }
        if (db.objectStoreNames.contains('projectDetails')) {
          db.deleteObjectStore('projectDetails')
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
        
        // Create user social accounts store
        const socialAccountStore = db.createObjectStore('userSocialAccounts', {
          keyPath: 'id'
        })
        
        // Create indexes for efficient querying
        socialAccountStore.createIndex('by-user', 'user_id')
        socialAccountStore.createIndex('by-provider', 'provider')
        
        // Create organizations store
        const organizationStore = db.createObjectStore('organizations', {
          keyPath: 'id'
        })
        organizationStore.createIndex('by-user', 'user_id')
        organizationStore.createIndex('by-slug', 'slug')
        
        // Create workspaces store
        const workspaceStore = db.createObjectStore('workspaces', {
          keyPath: 'id'
        })
        workspaceStore.createIndex('by-organization', 'organization_id')
        
        // Create projects store
        const projectStore = db.createObjectStore('projects', {
          keyPath: 'id'
        })
        projectStore.createIndex('by-workspace', 'workspace_id')
        projectStore.createIndex('by-status', 'status')
        projectStore.createIndex('by-featured', 'is_featured')
        
        // Create project details store
        const projectDetailStore = db.createObjectStore('projectDetails', {
          keyPath: 'id'
        })
        projectDetailStore.createIndex('by-project', 'project_id')
        
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
  const tx = db.transaction(['userEducations', 'userExperiences', 'userSkills', 'userSocialAccounts', 'organizations', 'workspaces', 'projects', 'projectDetails'], 'readwrite')
  
  await Promise.all([
    tx.objectStore('userEducations').clear(),
    tx.objectStore('userExperiences').clear(),
    tx.objectStore('userSkills').clear(),
    tx.objectStore('userSocialAccounts').clear(),
    tx.objectStore('organizations').clear(),
    tx.objectStore('workspaces').clear(),
    tx.objectStore('projects').clear(),
    tx.objectStore('projectDetails').clear(),
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

/* ============================================
 * USER SOCIAL ACCOUNTS FUNCTIONS
 * ============================================ */

/**
 * Get all social accounts from IndexedDB
 */
export async function getAllSocialAccounts(): Promise<UserSocialAccount[]> {
  try {
    const db = await getDB()
    return await db.getAll('userSocialAccounts')
  } catch (error) {
    console.error('❌ Error getting all social accounts from IndexedDB:', error)
    return []
  }
}

/**
 * Get social account by ID
 */
export async function getSocialAccountById(id: string): Promise<UserSocialAccount | undefined> {
  try {
    const db = await getDB()
    return await db.get('userSocialAccounts', id)
  } catch (error) {
    console.error('❌ Error getting social account by ID:', error)
    return undefined
  }
}

/**
 * Save all social accounts (replaces existing data)
 */
export async function saveAllSocialAccounts(accounts: UserSocialAccount[]): Promise<void> {
  try {
    const db = await getDB()
    const tx = db.transaction('userSocialAccounts', 'readwrite')
    
    // Clear existing data
    await tx.objectStore('userSocialAccounts').clear()
    
    // Add all social accounts
    for (const account of accounts) {
      await tx.objectStore('userSocialAccounts').put(account)
    }
    
    await tx.done
  } catch (error) {
    console.error('❌ Error saving social accounts to IndexedDB:', error)
    throw error
  }
}

/**
 * Save single social account (create or update)
 */
export async function saveSocialAccount(account: UserSocialAccount): Promise<void> {
  try {
    const db = await getDB()
    await db.put('userSocialAccounts', account)
  } catch (error) {
    console.error('❌ Error saving social account to IndexedDB:', error)
    throw error
  }
}

/**
 * Delete social account by ID
 */
export async function deleteSocialAccount(id: string): Promise<void> {
  try {
    const db = await getDB()
    await db.delete('userSocialAccounts', id)
  } catch (error) {
    console.error('❌ Error deleting social account from IndexedDB:', error)
    throw error
  }
}

/**
 * Get social accounts by user ID (using index)
 */
export async function getSocialAccountsByUserId(userId: string): Promise<UserSocialAccount[]> {
  try {
    const db = await getDB()
    return await db.getAllFromIndex('userSocialAccounts', 'by-user', userId)
  } catch (error) {
    console.error('❌ Error getting social accounts by user ID:', error)
    return []
  }
}

/**
 * Get social accounts by provider (using index)
 */
export async function getSocialAccountsByProvider(provider: string): Promise<UserSocialAccount[]> {
  try {
    const db = await getDB()
    return await db.getAllFromIndex('userSocialAccounts', 'by-provider', provider)
  } catch (error) {
    console.error('❌ Error getting social accounts by provider:', error)
    return []
  }
}

/* ============================================
 * PMS - ORGANIZATIONS FUNCTIONS
 * ============================================ */

export async function getAllOrganizations(): Promise<Organization[]> {
  try {
    const db = await getDB()
    return await db.getAll('organizations')
  } catch (error) {
    console.error('❌ Error getting organizations:', error)
    return []
  }
}

export async function getOrganizationById(id: string): Promise<Organization | undefined> {
  try {
    const db = await getDB()
    return await db.get('organizations', id)
  } catch (error) {
    console.error('❌ Error getting organization:', error)
    return undefined
  }
}

export async function saveAllOrganizations(organizations: Organization[]): Promise<void> {
  try {
    const db = await getDB()
    const tx = db.transaction('organizations', 'readwrite')
    await tx.objectStore('organizations').clear()
    for (const org of organizations) {
      await tx.objectStore('organizations').put(org)
    }
    await tx.done
  } catch (error) {
    console.error('❌ Error saving organizations:', error)
    throw error
  }
}

export async function saveOrganization(organization: Organization): Promise<void> {
  try {
    const db = await getDB()
    await db.put('organizations', organization)
  } catch (error) {
    console.error('❌ Error saving organization:', error)
    throw error
  }
}

export async function deleteOrganization(id: string): Promise<void> {
  try {
    const db = await getDB()
    await db.delete('organizations', id)
  } catch (error) {
    console.error('❌ Error deleting organization:', error)
    throw error
  }
}

/* ============================================
 * PMS - WORKSPACES FUNCTIONS
 * ============================================ */

export async function getAllWorkspaces(): Promise<Workspace[]> {
  try {
    const db = await getDB()
    return await db.getAll('workspaces')
  } catch (error) {
    console.error('❌ Error getting workspaces:', error)
    return []
  }
}

export async function getWorkspaceById(id: string): Promise<Workspace | undefined> {
  try {
    const db = await getDB()
    return await db.get('workspaces', id)
  } catch (error) {
    console.error('❌ Error getting workspace:', error)
    return undefined
  }
}

export async function getWorkspacesByOrganizationId(organizationId: string): Promise<Workspace[]> {
  try {
    const db = await getDB()
    return await db.getAllFromIndex('workspaces', 'by-organization', organizationId)
  } catch (error) {
    console.error('❌ Error getting workspaces by organization:', error)
    return []
  }
}

export async function saveAllWorkspaces(workspaces: Workspace[]): Promise<void> {
  try {
    const db = await getDB()
    const tx = db.transaction('workspaces', 'readwrite')
    await tx.objectStore('workspaces').clear()
    for (const workspace of workspaces) {
      await tx.objectStore('workspaces').put(workspace)
    }
    await tx.done
  } catch (error) {
    console.error('❌ Error saving workspaces:', error)
    throw error
  }
}

export async function saveWorkspace(workspace: Workspace): Promise<void> {
  try {
    const db = await getDB()
    await db.put('workspaces', workspace)
  } catch (error) {
    console.error('❌ Error saving workspace:', error)
    throw error
  }
}

export async function deleteWorkspace(id: string): Promise<void> {
  try {
    const db = await getDB()
    await db.delete('workspaces', id)
  } catch (error) {
    console.error('❌ Error deleting workspace:', error)
    throw error
  }
}

/* ============================================
 * PMS - PROJECTS FUNCTIONS
 * ============================================ */

export async function getAllProjects(): Promise<Project[]> {
  try {
    const db = await getDB()
    return await db.getAll('projects')
  } catch (error) {
    console.error('❌ Error getting projects:', error)
    return []
  }
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  try {
    const db = await getDB()
    return await db.get('projects', id)
  } catch (error) {
    console.error('❌ Error getting project:', error)
    return undefined
  }
}

export async function getProjectsByWorkspaceId(workspaceId: string): Promise<Project[]> {
  try {
    const db = await getDB()
    return await db.getAllFromIndex('projects', 'by-workspace', workspaceId)
  } catch (error) {
    console.error('❌ Error getting projects by workspace:', error)
    return []
  }
}

export async function getProjectsByStatus(status: string): Promise<Project[]> {
  try {
    const db = await getDB()
    return await db.getAllFromIndex('projects', 'by-status', status)
  } catch (error) {
    console.error('❌ Error getting projects by status:', error)
    return []
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const db = await getDB()
    return await db.getAllFromIndex('projects', 'by-featured', 1)
  } catch (error) {
    console.error('❌ Error getting featured projects:', error)
    return []
  }
}

export async function saveAllProjects(projects: Project[]): Promise<void> {
  try {
    const db = await getDB()
    const tx = db.transaction('projects', 'readwrite')
    await tx.objectStore('projects').clear()
    for (const project of projects) {
      await tx.objectStore('projects').put(project)
    }
    await tx.done
  } catch (error) {
    console.error('❌ Error saving projects:', error)
    throw error
  }
}

export async function saveProject(project: Project): Promise<void> {
  try {
    const db = await getDB()
    await db.put('projects', project)
  } catch (error) {
    console.error('❌ Error saving project:', error)
    throw error
  }
}

export async function deleteProject(id: string): Promise<void> {
  try {
    const db = await getDB()
    await db.delete('projects', id)
  } catch (error) {
    console.error('❌ Error deleting project:', error)
    throw error
  }
}

/* ============================================
 * PMS - PROJECT DETAILS FUNCTIONS
 * ============================================ */

export async function getAllProjectDetails(): Promise<ProjectDetail[]> {
  try {
    const db = await getDB()
    return await db.getAll('projectDetails')
  } catch (error) {
    console.error('❌ Error getting project details:', error)
    return []
  }
}

export async function getProjectDetailById(id: string): Promise<ProjectDetail | undefined> {
  try {
    const db = await getDB()
    return await db.get('projectDetails', id)
  } catch (error) {
    console.error('❌ Error getting project detail:', error)
    return undefined
  }
}

export async function getProjectDetailByProjectId(projectId: string): Promise<ProjectDetail | undefined> {
  try {
    const db = await getDB()
    const details = await db.getAllFromIndex('projectDetails', 'by-project', projectId)
    return details[0]
  } catch (error) {
    console.error('❌ Error getting project detail by project:', error)
    return undefined
  }
}

export async function saveProjectDetail(detail: ProjectDetail): Promise<void> {
  try {
    const db = await getDB()
    await db.put('projectDetails', detail)
  } catch (error) {
    console.error('❌ Error saving project detail:', error)
    throw error
  }
}

export async function deleteProjectDetail(id: string): Promise<void> {
  try {
    const db = await getDB()
    await db.delete('projectDetails', id)
  } catch (error) {
    console.error('❌ Error deleting project detail:', error)
    throw error
  }
}
