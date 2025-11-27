/**
 * GraphQL Proxy Endpoint
 * Forwards all GraphQL requests to backend with httpOnly cookie
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'auth_token')
  const body = await readBody(event)

  try {
    // Forward GraphQL request to backend
    const response = await $fetch(`${config.public.apiUrl}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add Authorization header if token exists
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body,
    })

    return response
  } catch (error: any) {
    console.error('GraphQL proxy error:', error)
    
    // If unauthorized, clear the cookie
    if (error.statusCode === 401 || error.response?.status === 401) {
      deleteCookie(event, 'auth_token', {
        httpOnly: true,
        secure: !import.meta.dev,
        sameSite: 'lax',
        path: '/',
      })
    }

    throw error
  }
})
