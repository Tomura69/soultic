import { Resolver, Mutation, Arg, Ctx } from 'type-graphql'
import { LoginInput } from '../../shared/graphql/inputs/login.input'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { UserRepo } from '../../../repositories/UserRepo'
import * as bcrypt from 'bcryptjs'
import { MyContext } from '../../../types/MyContext'
import { staff } from '../../shared/types/staff'
import { timeStamp } from 'console'
import { User } from '../../../entities/User'

@Resolver()
export class AdminLoginResolver {
  @InjectRepository()
  private userRepo: UserRepo

  @Mutation(() => User, { nullable: true })
  async login(
    @Arg('input') { email, password }: LoginInput,
    @Ctx() ctx: MyContext
  ): Promise<User | undefined> {
    return this.userRepo.login({ email, password }, ctx, true)
  }
}
