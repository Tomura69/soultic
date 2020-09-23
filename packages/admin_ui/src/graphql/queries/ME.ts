import gql from 'graphql-tag'

export default gql`
  query AdminMe {
    me {
      id
      email
      firstname
      lastname
    }
  }
`
