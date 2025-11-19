export const useSocialAuth = () => {
  const config = useRuntimeConfig()
  const toast = useToast()

  /**
   * Initiate social authentication with the specified provider
   * @param provider - 'google' or 'github'
   */
  const loginWithProvider = (provider: 'google' | 'github') => {
    try {
      // Construct the redirect URL
      const redirectUrl = `${config.public.apiUrl}/auth/${provider}/redirect`
      
      // Open the OAuth provider's authorization page
      window.location.href = redirectUrl
    } catch (error) {
      console.error(`Error initiating ${provider} login:`, error)
      toast.add({
        title: 'Authentication Error',
        description: `Failed to initiate ${provider} login. Please try again.`,
        color: 'error'
      })
    }
  }

  /**
   * Login with Google
   */
  const loginWithGoogle = () => {
    loginWithProvider('google')
  }

  /**
   * Login with GitHub
   */
  const loginWithGithub = () => {
    loginWithProvider('github')
  }

  return {
    loginWithProvider,
    loginWithGoogle,
    loginWithGithub
  }
}
