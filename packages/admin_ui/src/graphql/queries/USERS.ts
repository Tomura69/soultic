import gql from 'graphql-tag'

export default gql`
  query UsersList($options: UserListOptions!) {
    users(options: $options) {
      items {
        id
        firstname
        lastname
        email
        roles
        confirmed
        createdAt
        updatedAt
        deletedAt
      }
      totalCount
    }
  }
`
