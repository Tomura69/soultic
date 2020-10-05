import { Request } from 'express'
import { SessionEntity } from '../lib/session/TypeormStore'
import { User } from '../entities/user/user.entity'

export interface MyContext {
  req: Request
  session: SessionEntity & Express.Session
  user?: User
}
