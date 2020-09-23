import { Role } from './role';

export interface IPermission {
  [key: string]: Role[];
}
const createPermissions = <M extends IPermission>(resolver: M) => resolver;

export const Permission = createPermissions({
  updateUser: [Role.ADMIN],
  deleteUser: [Role.ADMIN],
  restoreUser: [Role.ADMIN],
  getUsers: [Role.ADMIN, Role.EMPLOYEE],
  getUser: [Role.ADMIN, Role.EMPLOYEE],
});
