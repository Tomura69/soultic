import { AdminUserResolver } from '../resolvers/admin-api/user.resolver'
import { createSchema } from '../../utils/createSchema'
import { ErrorInterceptor } from '../middleware/global/ErrorInterceptor'
import { IsStaff } from '../middleware/global/IsStaff'
import { BuildSchemaOptions } from 'type-graphql'
import { AdminProductResolver } from '../resolvers/admin-api/product.resolver'
import { FacetResolver } from '../resolvers/admin-api/facet-resolver'

const resolvers: BuildSchemaOptions['resolvers'] = [
  AdminProductResolver,
  AdminUserResolver,
  FacetResolver,
]
const globalMiddleware = [ErrorInterceptor, IsStaff]

export const adminSchema = createSchema(resolvers, globalMiddleware)
