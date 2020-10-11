import { Request } from 'express'
import { SessionEntity } from '../lib/session/TypeormStore'
import { User } from '../entities/user/user.entity'
import { LanguageCode } from '../api/types/languageCode'

export interface MyContext {
  req: Request
  languageCode: LanguageCode
  session: SessionEntity & Express.Session
  user?: User
}
