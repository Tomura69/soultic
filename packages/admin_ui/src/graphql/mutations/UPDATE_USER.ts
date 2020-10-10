import gql from 'graphql-tag'

export default gql`
  mutation UpdateUser($id: Int!, $input: UserUpdateInput!) {
    updateUser(id: $id, input: $input)
  }
`
