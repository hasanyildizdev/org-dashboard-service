import type { AuthPayload, RegisterCredentials } from '~/types/core_types'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody<RegisterCredentials>(event)

  try {
    // Call GraphQL backend
    const response = await $fetch<{ data?: { register: AuthPayload }, errors?: any[] }>(
      `${config.public.apiUrl}/graphql`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          query: `
            mutation Register(
              $name: String!
              $email: String!
              $password: String!
              $password_confirmation: String!
            ) {
              register(
                name: $name
                email: $email
                password: $password
                password_confirmation: $password_confirmation
              ) {
                access_token
                token_type
                user {
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
            }
          `,
          variables: {
            name: body.name,
            email: body.email,
            password: body.password,
            password_confirmation: body.password_confirmation,
          },
        },
      }
    )

    if (response.errors?.length) {
      const errors = response.errors
      const messages = errors
        .map((err: any) => {
          if (err.extensions?.validation) {
            return Object.values(err.extensions.validation).flat().join(' ')
          }
          return err.message
        })
        .join(' ')

      throw createError({
        statusCode: 422,
        message: messages,
      })
    }

    const payload = response.data?.register
    if (!payload?.access_token) {
      throw createError({
        statusCode: 422,
        message: 'Registration failed. No token received.',
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
    console.error('Register error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Registration failed',
    })
  }
})
