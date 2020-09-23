import { MiddlewareFn, ArgumentValidationError } from 'type-graphql';
import { __ } from 'i18n';
import { ValidationError } from 'class-validator';
import { AppError } from '../../../utils/AppError';

export const ErrorInterceptor: MiddlewareFn<any> = async (
  { context, info },
  next
) => {
  try {
    return await next();
  } catch (err) {
    if (process.env.NODE_ENV === 'production') sendErrorProd(err);
    // rethrow the error
    throw err;
  }
};

const sendErrorProd = (err: AppError) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) throw new Error(err.message);
  // Arguments validation error: leave it as it is
  else if (err instanceof ArgumentValidationError) throw err;
  // Unknown error: don't leak details to client
  else {
    console.error('ERROR:', err);
    throw new Error(__('error.something-went-wrong'));
  }
};
