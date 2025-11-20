import { gql } from 'graphql-request'

export const useEmailVerification = () => {
  const { $graphql } = useNuxtApp()
  const toast = useToast()

  /**
   * Verify email address
   */
  const verifyEmail = async (userId: string) => {
    const VERIFY_EMAIL_MUTATION = gql`
      mutation VerifyEmail($id: ID!) {
        verifyEmail(id: $id) {
          status
          message
          verified
        }
      }
    `

    try {
      const data = await $graphql.request<{
        verifyEmail: {
          status: string
          message: string
          verified: boolean
        }
      }>(VERIFY_EMAIL_MUTATION, { id: userId })

      return {
        success: true,
        data: data.verifyEmail
      }
    } catch (error: any) {
      console.error('Email verification error:', error)
      return {
        success: false,
        error: error.response?.errors?.[0]?.message || 'Email verification failed'
      }
    }
  }

  /**
   * Resend verification email
   */
  const resendVerificationEmail = async () => {
    const RESEND_VERIFICATION_MUTATION = gql`
      mutation ResendVerificationEmail {
        resendVerificationEmail {
          status
          message
        }
      }
    `

    try {
      const data = await $graphql.request<{
        resendVerificationEmail: {
          status: string
          message: string
        }
      }>(RESEND_VERIFICATION_MUTATION)

      toast.add({
        title: 'Success',
        description: data.resendVerificationEmail.message,
        color: 'success'
      })

      return {
        success: true,
        data: data.resendVerificationEmail
      }
    } catch (error: any) {
      console.error('Resend verification error:', error)
      
      const errorMessage = error.response?.errors?.[0]?.message || 'Failed to resend verification email'
      
      toast.add({
        title: 'Error',
        description: errorMessage,
        color: 'error'
      })

      return {
        success: false,
        error: errorMessage
      }
    }
  }

  return {
    verifyEmail,
    resendVerificationEmail
  }
}
