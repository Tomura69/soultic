import { MiddlewareFn, UseMiddleware } from 'type-graphql';
import { MyContext } from '../../../types/MyContext';
import { __ } from 'i18n';
import { AppError } from '../../../utils/AppError';

const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  if (!context.user) throw new AppError(__('error.must-login'));
  return next();
};

export function IsAuth() {
  return UseMiddleware(isAuth);
}
