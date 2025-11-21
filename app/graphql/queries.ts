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
