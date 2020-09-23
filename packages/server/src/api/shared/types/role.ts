import { registerEnumType } from 'type-graphql';

export enum Role {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
  CUSTOMER = 'CUSTOMER', //TODO:  Remove customer as role
}

registerEnumType(Role, {
  name: 'Role',
  description: 'System roles',
});
