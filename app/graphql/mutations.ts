export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      access_token
      token_type
      expires_in
      user {
        id
        name
        email
        email_verified_at
        avatar
        created_at
        updated_at
      }
    }
  }
`

export const REGISTER_MUTATION = gql`
mutation Register($name: String!, $email: String!, $password: String!, $password_confirmation: String!) {
    register(name: $name, email: $email, password: $password, password_confirmation: $password_confirmation) {
    access_token
    token_type
    expires_in
    user {
        id
        name
        email
        email_verified_at
        avatar
        created_at
        updated_at
    }
    }
}
`

export const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($name: String!, $email: String!, $profession_id: ID) {
    updateProfile(name: $name, email: $email, profession_id: $profession_id) {
      id
      name
      email
      email_verified_at
      profession_id
      profession {
        id
        name
      }
      created_at
      updated_at
    }
  }
`

export const LOGOUT_MUTATION = gql`
mutation Logout {
    logout {
    status
    message
    }
}
`

export const VERIFY_EMAIL_MUTATION = gql`
  mutation VerifyEmail($id: ID!, $hash: String!, $expires: Int!, $signature: String!) {
    verifyEmail(id: $id, hash: $hash, expires: $expires, signature: $signature) {
      status
      message
      verified
    }
  }
`
export const RESEND_VERIFICATION_MUTATION = gql`
  mutation ResendVerificationEmail {
    resendVerificationEmail {
      status
      message
    }
  }
`

export const DELETE_ACCOUNT_MUTATION = gql`
  mutation DeleteAccount {
    deleteAccount {
      status
      message
    }
  }
`