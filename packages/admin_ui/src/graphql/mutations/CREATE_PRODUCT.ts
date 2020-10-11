import gql from 'graphql-tag'

export default gql`
  mutation createProduct($input: ProductInput!) {
    createProduct(input: $input) {
      id
      languageCode
    }
  }
`
