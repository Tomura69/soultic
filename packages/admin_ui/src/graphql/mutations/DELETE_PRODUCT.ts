import gql from 'graphql-tag'

export default gql`
  mutation deleteProduct($id: Int!) {
    deleteProduct(id: $id)
  }
`
