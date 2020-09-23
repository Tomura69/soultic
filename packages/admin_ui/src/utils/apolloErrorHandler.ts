import { onError } from 'apollo-link-error'
import useToast from '@/modules/useToast'

const apolloErrorHandler = onError(
  ({ graphQLErrors, networkError, operation }) => {
    const { addToast } = useToast()

    if (graphQLErrors && operation.operationName !== 'AdminMe') {
      graphQLErrors.forEach((error) => {
        addToast({ type: 'error', message: error.message })
      })
    }

    if (networkError) addToast({ type: 'error', message: networkError.message })
  }
)

export default apolloErrorHandler
