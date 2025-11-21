import { RESEND_VERIFICATION_MUTATION, VERIFY_EMAIL_MUTATION } from '~/graphql/mutations'

export const useEmailVerification = () => {
  const toast = useToast()
  const verifyEmail = async (params: {
    id: string
    hash: string
    expires: string
    signature: string
  }) => {
    try {
      const { mutate } = useMutation<{
        verifyEmail: {
          status: string
          message: string
          verified: boolean
        }
      }>(VERIFY_EMAIL_MUTATION)
      const result = await mutate({
        id: params.id,
        hash: params.hash,
        expires: parseInt(params.expires),
        signature: params.signature
      })
      return {
        success: true,
        data: result?.data?.verifyEmail
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
    try {
      const { mutate } = useMutation<{
        resendVerificationEmail: {
          status: string
          message: string
        }
      }>(RESEND_VERIFICATION_MUTATION)
      const result = await mutate()
      toast.add({
        title: 'Success',
        description: result?.data?.resendVerificationEmail.message,
        color: 'success'
      })
      return {
        success: true,
        data: result?.data?.resendVerificationEmail
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
