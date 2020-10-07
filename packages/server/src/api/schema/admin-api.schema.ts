import { AdminUserResolver } from '../resolvers/admin-api/user.resolver'
import { createSchema } from '../../utils/createSchema'
import { ErrorInterceptor } from '../middleware/global/ErrorInterceptor'
import { IsStaff } from '../middleware/global/IsStaff'
import { BuildSchemaOptions } from 'type-graphql'
import { AdminProductResolver } from '../resolvers/admin-api/product.resolver'
import { FacetResolver } from '../resolvers/admin-api/facet-resolver'
import { AdminProductVariantResolver } from '../resolvers/admin-api/product-variant.resolver'

const resolvers: BuildSchemaOptions['resolvers'] = [
  AdminProductResolver,
  AdminProductVariantResolver,
  AdminUserResolver,
  FacetResolver,
]
const globalMiddleware = [ErrorInterceptor, IsStaff]

export const adminSchema = createSchema(resolvers, globalMiddleware)
