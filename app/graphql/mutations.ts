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
        profession_id
        profession {
          id
          name
          slug
        }
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
        profession_id
        profession {
          id
          name
          slug
        }
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
      avatar
      profession_id
      profession {
        id
        name
        slug
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

export const CREATE_USER_EDUCATION_MUTATION = gql`
  mutation CreateUserEducation($input: UserEducationInput!) {
    createUserEducation(input: $input) {
      id
      user_id
      institution
      degree
      field_of_study
      city
      country
      start_month
      start_year
      end_month
      end_year
      grade
      is_current
      description
      start_date_formatted
      end_date_formatted
      education_period
      created_at
      updated_at
    }
  }
`

export const UPDATE_USER_EDUCATION_MUTATION = gql`
  mutation UpdateUserEducation($id: ID!, $input: UserEducationInput!) {
    updateUserEducation(id: $id, input: $input) {
      id
      user_id
      institution
      degree
      field_of_study
      city
      country
      start_month
      start_year
      end_month
      end_year
      grade
      is_current
      description
      start_date_formatted
      end_date_formatted
      education_period
      created_at
      updated_at
    }
  }
`

export const DELETE_USER_EDUCATION_MUTATION = gql`
  mutation DeleteUserEducation($id: ID!) {
    deleteUserEducation(id: $id)
  }
`

export const CREATE_USER_EXPERIENCE_MUTATION = gql`
  mutation CreateUserExperience($input: UserExperienceInput!) {
    createUserExperience(input: $input) {
      id
      user_id
      company
      title
      city
      country
      start_month
      start_year
      end_month
      end_year
      description
      is_current
      start_date_formatted
      end_date_formatted
      experience_period
      created_at
      updated_at
    }
  }
`

export const UPDATE_USER_EXPERIENCE_MUTATION = gql`
  mutation UpdateUserExperience($id: ID!, $input: UserExperienceInput!) {
    updateUserExperience(id: $id, input: $input) {
      id
      user_id
      company
      title
      city
      country
      start_month
      start_year
      end_month
      end_year
      description
      is_current
      start_date_formatted
      end_date_formatted
      experience_period
      created_at
      updated_at
    }
  }
`

export const DELETE_USER_EXPERIENCE_MUTATION = gql`
  mutation DeleteUserExperience($id: ID!) {
    deleteUserExperience(id: $id)
  }
`

export const CREATE_USER_SKILL_MUTATION = gql`
  mutation CreateUserSkill($input: UserSkillInput!) {
    createUserSkill(input: $input) {
      id
      user_id
      name
      level
      is_primary
      created_at
      updated_at
    }
  }
`

export const UPDATE_USER_SKILL_MUTATION = gql`
  mutation UpdateUserSkill($id: ID!, $input: UserSkillInput!) {
    updateUserSkill(id: $id, input: $input) {
      id
      user_id
      name
      level
      is_primary
      created_at
      updated_at
    }
  }
`

export const DELETE_USER_SKILL_MUTATION = gql`
  mutation DeleteUserSkill($id: ID!) {
    deleteUserSkill(id: $id)
  }
`

export const CREATE_USER_SOCIAL_ACCOUNT_MUTATION = gql`
  mutation CreateUserSocialAccount($input: UserSocialAccountInput!) {
    createUserSocialAccount(input: $input) {
      id
      user_id
      provider
      username
      created_at
      updated_at
    }
  }
`

export const UPDATE_USER_SOCIAL_ACCOUNT_MUTATION = gql`
  mutation UpdateUserSocialAccount($id: ID!, $input: UserSocialAccountInput!) {
    updateUserSocialAccount(id: $id, input: $input) {
      id
      user_id
      provider
      username
      created_at
      updated_at
    }
  }
`

export const DELETE_USER_SOCIAL_ACCOUNT_MUTATION = gql`
  mutation DeleteUserSocialAccount($id: ID!) {
    deleteUserSocialAccount(id: $id)
  }
`
// ==========================================
// PMS (Project Management System) Mutations
// ==========================================

export const CREATE_ORGANIZATION_MUTATION = gql`
  mutation CreateOrganization($input: OrganizationInput!) {
    createOrganization(input: $input) {
      id
      user_id
      name
      slug
    }
  }
`

export const UPDATE_ORGANIZATION_MUTATION = gql`
  mutation UpdateOrganization($id: ID!, $input: OrganizationInput!) {
    updateOrganization(id: $id, input: $input) {
      id
      user_id
      name
      slug
    }
  }
`

export const DELETE_ORGANIZATION_MUTATION = gql`
  mutation DeleteOrganization($id: ID!) {
    deleteOrganization(id: $id)
  }
`