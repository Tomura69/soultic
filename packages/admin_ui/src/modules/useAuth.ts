import { useMutation } from '@vue/apollo-composable'
import LOGIN from '@/graphql/mutations/LOGIN'
import LOGOUT from '@/graphql/mutations/LOGOUT'
import {
  LoginInput,
  AdminLoginMutation,
  AdminLogoutMutation,
} from '@/generated/graphql'

const useAuth = () => {
  const login = useMutation<AdminLoginMutation, LoginInput>(LOGIN)
  const logout = useMutation<AdminLogoutMutation>(LOGOUT)

  return { login, logout }
}

export default useAuth
