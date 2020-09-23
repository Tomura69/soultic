import gql from 'graphql-tag'

export default gql`
  mutation UpdateUser($id: ID!, $input: UserUpdateInput!) {
    updateUser(id: $id, input: $input)
  }
`
