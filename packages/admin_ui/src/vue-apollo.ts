import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { ApolloLink } from 'apollo-link'
import apolloErrorHandler from '@/utils/apolloErrorHandler'

const httpLink = new HttpLink({
  credentials: 'include',
  uri: 'http://localhost:4000/admin-api',
})

export default new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([apolloErrorHandler, httpLink]),
})
