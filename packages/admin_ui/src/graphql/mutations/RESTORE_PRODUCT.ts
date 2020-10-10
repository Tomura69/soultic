import gql from 'graphql-tag'

export default gql`
  mutation restoreProduct($id: Int!) {
    restoreProduct(id: $id)
  }
`
