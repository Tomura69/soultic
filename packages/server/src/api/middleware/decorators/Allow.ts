import { MiddlewareFn, UseMiddleware } from 'type-graphql';
import { MyContext } from '../../../types/MyContext';
import { Role } from '../../shared/types/role';
import { Permission } from '../../shared/types/permission';
import { __ } from 'i18n';
import { AppError } from '../../../utils/AppError';

type PermissionValue = typeof Permission[keyof typeof Permission][];

function hasPermission(
  ...permission: PermissionValue
): MiddlewareFn<MyContext> {
  return async ({ context }, next) => {
    const permissions = ([] as Role[]).concat.apply([], permission);

    const user = context.user!;

    if (permissions.some((role: Role) => user.roles.includes(role)))
      return next();
    else throw new AppError(__('error.access-denied'));
  };
}

export function Allow(...permissions: PermissionValue) {
  return UseMiddleware(hasPermission(...permissions));
}
