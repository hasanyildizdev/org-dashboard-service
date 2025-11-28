import type { User } from '~/types/core_types'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'auth_token')

  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated',
    })
  }

  try {
    // Call GraphQL backend to get user data
    const response = await $fetch<{ data?: { me: User }, errors?: any[] }>(
      `${config.public.apiUrl}/graphql`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: {
          query: `
            query Me {
              me {
                id
                name
                email
                email_verified_at
                profession_id
                profession {
                  id
                  name
                }
                phone
                country
                city
                created_at
                updated_at
              }
            }
          `,
        },
      }
    )

    if (response.errors?.length) {
      throw createError({
        statusCode: 401,
        message: response.errors[0].message || 'Failed to fetch user',
      })
    }

    const user = response.data?.me
    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'User not found',
      })
    }

    return {
      success: true,
      user,
    }
  } catch (error: any) {
    console.error('Me query error:', error)
    
    // Clear invalid token
    deleteCookie(event, 'auth_token', {
      httpOnly: true,
      secure: !import.meta.dev,
      sameSite: 'lax',
      path: '/',
    })

    throw createError({
      statusCode: error.statusCode || 401,
      message: error.message || 'Failed to fetch user',
    })
  }
})
