import gql from 'graphql-tag'

export default gql`
  query UserById($id: Int!) {
    user(id: $id) {
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
  }
`
