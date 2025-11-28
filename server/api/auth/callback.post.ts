import type { User } from '~/types/core_types'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody<{ token: string }>(event)

  if (!body.token) {
    throw createError({
      statusCode: 400,
      message: 'No token provided',
    })
  }

  // Set httpOnly cookie with the social auth token
  setCookie(event, 'auth_token', body.token, {
    httpOnly: true,
    secure: !import.meta.dev,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  try {
    // Fetch user data using the token
    const response = await $fetch<{ data?: { me: User }, errors?: any[] }>(
      `${config.public.apiUrl}/graphql`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${body.token}`,
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
    console.error('Callback error:', error)
    
    // Clear invalid token
    deleteCookie(event, 'auth_token', {
      httpOnly: true,
      secure: !import.meta.dev,
      sameSite: 'lax',
      path: '/',
    })

    throw createError({
      statusCode: error.statusCode || 401,
      message: error.message || 'Authentication failed',
    })
  }
})
