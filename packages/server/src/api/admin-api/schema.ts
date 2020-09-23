import { UserResolver } from './user/user.resolver'
import { AdminLoginResolver } from './user/login.resolver'
import { createSchema } from '../../utils/createSchema'
import { ErrorInterceptor } from '../middleware/global/ErrorInterceptor'
import { IsStaff } from '../middleware/global/IsStaff'
import { BuildSchemaOptions } from 'type-graphql'
import { AdminMeResolver } from './user/me.resolver'
import { AdminLogoutResolver } from './user/logout.resolver'

const resolvers: BuildSchemaOptions['resolvers'] = [
  UserResolver,
  AdminLoginResolver,
  AdminMeResolver,
  AdminLogoutResolver,
]
const globalMiddleware = [ErrorInterceptor, IsStaff]

export const adminSchema = createSchema(resolvers, globalMiddleware)
