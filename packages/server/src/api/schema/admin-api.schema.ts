import { AdminUserResolver } from '../resolvers/admin-api/user.resolver'
import { createSchema } from '../../utils/createSchema'
import { ErrorInterceptor } from '../middleware/global/ErrorInterceptor'
import { IsStaff } from '../middleware/global/IsStaff'
import { BuildSchemaOptions } from 'type-graphql'
import { AdminProductResolver } from '../resolvers/admin-api/product.resolver'

const resolvers: BuildSchemaOptions['resolvers'] = [
  AdminProductResolver,
  AdminUserResolver,
]
const globalMiddleware = [ErrorInterceptor, IsStaff]

export const adminSchema = createSchema(resolvers, globalMiddleware)
