import gql from 'graphql-tag'

export default gql`
  mutation updateOrCreateProductTranslation(
    $id: Int!
    $input: ProductTranslationUpdateInput!
  ) {
    updateOrCreateProductTranslation(id: $id, input: $input)
  }
`
