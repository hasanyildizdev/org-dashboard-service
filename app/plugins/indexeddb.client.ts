/**
 * IndexedDB Initialization Plugin
 * This plugin initializes IndexedDB when the app starts (client-side only)
 * The .client.ts suffix ensures this only runs on the client
 */
export default defineNuxtPlugin(async () => {
  try {
    // Initialize the database by importing the db utility
    const { getDB } = await import('~/utils/db')
    await getDB()
    console.log('🗄️ IndexedDB initialized successfully')
  } catch (error) {
    console.error('❌ Failed to initialize IndexedDB:', error)
  }
})
