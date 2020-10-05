import { registerEnumType } from 'type-graphql'

export enum Role {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
}

registerEnumType(Role, {
  name: 'Role',
  description: 'System roles',
})
