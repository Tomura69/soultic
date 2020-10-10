import gql from 'graphql-tag'

export default gql`
  query ProductById($id: Int!) {
    product(id: $id) {
      id
      languageCode
      translations {
        id
        languageCode
        title
        slug
        description
      }
      variants {
        id
        price
        sku
      }
      createdAt
      updatedAt
      deletedAt
    }
  }
`
