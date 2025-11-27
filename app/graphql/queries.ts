export const GET_PROFESSIONS = gql`
  query GetProfessions {
    professions {
      id
      name
      slug
      sort_order
      is_active
    }
  }
`

export const ME_QUERY = gql`
  query Me {
    me {
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

export const GET_USER_EDUCATIONS = gql`
  query GetUserEducations {
    userEducations {
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

export const GET_USER_EXPERIENCES = gql`
  query GetUserExperiences {
    userExperiences {
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

export const GET_USER_SKILLS = gql`
  query GetUserSkills {
    userSkills {
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
