import gql from 'graphql-tag'

export default gql`
  mutation restoreUser($id: Int!) {
    restoreUser(id: $id)
  }
`
