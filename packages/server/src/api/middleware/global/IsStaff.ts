import { MiddlewareFn } from 'type-graphql';
import { __ } from 'i18n';
import { AppError } from '../../../utils/AppError';
import { MyContext } from '../../../types/MyContext';
import { staff } from '../../shared/types/staff';

export const IsStaff: MiddlewareFn<MyContext> = async (
  { context, args, info },
  next
) => {
  const resolverMetadata = info.parentType.getFields()[info.fieldName];
  if (
    (context.user && context.user.roles.some((role) => staff.includes(role))) ||
    resolverMetadata.name === 'login'
  ) {
    return next();
  } else throw new AppError(__('error.access-denied'));
};
