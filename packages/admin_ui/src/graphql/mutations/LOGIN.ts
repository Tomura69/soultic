import gql from 'graphql-tag'

export default gql`
  mutation AdminLogin($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      id
      email
      firstname
      lastname
    }
  }
`
