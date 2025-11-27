export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'auth_token')

  if (token) {
    try {
      // Call GraphQL backend to logout (invalidate token)
      await $fetch(`${config.public.apiUrl}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: {
          query: `
            mutation Logout {
              logout {
                status
                message
              }
            }
          `,
        },
      })
    } catch (error) {
      // Ignore backend errors, still clear the cookie
      console.error('Logout backend error:', error)
    }
  }

  // Clear httpOnly cookie
  deleteCookie(event, 'auth_token', {
    httpOnly: true,
    secure: !import.meta.dev,
    sameSite: 'lax',
    path: '/',
  })

  return {
    success: true,
    message: 'Logged out successfully',
  }
})
