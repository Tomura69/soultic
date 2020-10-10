import gql from 'graphql-tag'

export default gql`
  mutation generateProductTranslationSlug($id: Int, $title: String!) {
    generateProductTranslationSlug(id: $id, title: $title)
  }
`
