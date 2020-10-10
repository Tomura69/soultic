import gql from 'graphql-tag'

export default gql`
  mutation deleteUser($id: Int!) {
    deleteUser(id: $id)
  }
`
