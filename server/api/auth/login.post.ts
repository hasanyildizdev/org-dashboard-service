import type { AuthPayload, LoginCredentials } from '~/types/core_types'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody<LoginCredentials>(event)

  try {
    // Call GraphQL backend
    const response = await $fetch<{ data?: { login: AuthPayload }, errors?: any[] }>(
      `${config.public.apiUrl}/graphql`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          query: `
            mutation Login($email: String!, $password: String!) {
              login(email: $email, password: $password) {
                access_token
                token_type
                user {
                  id
                  name
                  email
                  email_verified_at
                  profession_id
                  created_at
                  updated_at
                  profession {
                    id
                    name
                  }
                }
              }
            }
          `,
          variables: {
            email: body.email,
            password: body.password,
          },
        },
      }
    )

    if (response.errors?.length) {
      throw createError({
        statusCode: 401,
        message: response.errors[0].message || 'Login failed',
      })
    }

    const payload = response.data?.login
    if (!payload?.access_token) {
      throw createError({
        statusCode: 401,
        message: 'Login failed. No token received.',
      })
    }

    // Set httpOnly cookie (secure, can't be accessed by JavaScript)
    setCookie(event, 'auth_token', payload.access_token, {
      httpOnly: true,
      secure: !import.meta.dev,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    // Return user data (NOT the token)
    return {
      success: true,
      user: payload.user,
    }
  } catch (error: any) {
    console.error('Login error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Login failed',
    })
  }
})
