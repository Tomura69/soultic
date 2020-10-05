import { BuildSchemaOptions } from 'type-graphql'

import { createSchema } from '../../utils/createSchema'
import { ErrorInterceptor } from '../middleware/global/ErrorInterceptor'
import { UserResolver } from '../resolvers/shop-api/user.resolver'

const resolvers: BuildSchemaOptions['resolvers'] = [UserResolver]
const globalMiddleware = [ErrorInterceptor]

export const shopSchema = createSchema(resolvers, globalMiddleware)
