import gql from 'graphql-tag'

export default gql`
  query ProductList($options: ProductListOptions!) {
    products(options: $options) {
      items {
        id
        title
        slug
        createdAt
        updatedAt
        deletedAt
      }
      totalCount
    }
  }
`
