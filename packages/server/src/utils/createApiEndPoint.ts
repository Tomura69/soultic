import 'dotenv'
import { ApolloServer, CorsOptions } from 'apollo-server-express'
import { MyContext } from '../types/MyContext'
import { User } from '../entities/user/user.entity'
import { GraphQLSchema } from 'graphql'
import { Application } from 'express'
import session, { SessionOptions } from 'express-session'

export const createApiEndPoint = async (
  endpoint: string,
  expressApp: Application,
  cors: CorsOptions,
  apiSchema: Promise<GraphQLSchema>,
  sessionOptions: SessionOptions | undefined = undefined
) => {
  const schema = await apiSchema

  if (sessionOptions) expressApp.use(endpoint, session(sessionOptions))

  const api = new ApolloServer({
    tracing: process.env.NODE_ENV !== 'production',
    debug: process.env.NODE_ENV !== 'production',
    schema,
    context: ({ req }): MyContext => {
      return {
        req,
        session: req.session as any,
        user: req.session!.user as User,
      }
    },
  })

  api.applyMiddleware({
    app: expressApp,
    path: endpoint,
    cors: false,
  })
}
