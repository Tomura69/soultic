import { Resolver, Mutation, Arg, Ctx } from 'type-graphql'
import * as bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'
import { User } from '../../../entities/User'
import { LoginInput } from '../../shared/graphql/inputs/login.input'
import { MyContext } from '../../../types/MyContext'
import { UserRepo } from '../../../repositories/UserRepo'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { __ } from 'i18n'
import { AppError } from '../../../utils/AppError'

dotenv.config()

@Resolver()
export class LoginResolver {
  @InjectRepository()
  private readonly userRepo: UserRepo

  @Mutation(() => User, { nullable: true })
  async login(
    @Arg('input') { email, password }: LoginInput,
    @Ctx() ctx: MyContext
  ): Promise<User | undefined> {
    return this.userRepo.login({ email, password }, ctx)
  }
}
