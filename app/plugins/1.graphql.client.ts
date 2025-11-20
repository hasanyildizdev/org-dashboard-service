import { GraphQLClient } from 'graphql-request'

export default defineNuxtPlugin({
  name: 'graphql',
  parallel: false,
  setup() {
    const config = useRuntimeConfig()
    const graphqlClient = new GraphQLClient(config.public.graphqlEndpoint as string, {
      headers: () => {
        const token = useCookie('auth_token').value
        const headers: Record<string, string> = {}
        if (token) {
          headers.Authorization = `Bearer ${token}`
        }
        return headers
      }
    })
    console.log('GraphQL client initialized')
    return {
      provide: {
        graphql: graphqlClient
      }
    }
  }
})
