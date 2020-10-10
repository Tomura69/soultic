import gql from 'graphql-tag'

export default gql`
  query ProductList($options: ProductListOptions!) {
    products(options: $options) {
      items {
        id
        title
        slug
        languageCode
        createdAt
        updatedAt
        deletedAt
      }
      totalCount
    }
  }
`
