import { createSchema } from '../../utils/createSchema';
import { ErrorInterceptor } from '../middleware/global/ErrorInterceptor';
import { BuildSchemaOptions } from 'type-graphql';
import { LoginResolver } from './user/login.resolver';
import { MeResolver } from './user/me.resolver';
import { RegisterResolver } from './user/register.resolver';
import { LogoutResolver } from './user/logout.resolver';

const resolvers: BuildSchemaOptions['resolvers'] = [
  LoginResolver,
  MeResolver,
  RegisterResolver,
  LogoutResolver,
];
const globalMiddleware = [ErrorInterceptor];

export const shopSchema = createSchema(resolvers, globalMiddleware);
