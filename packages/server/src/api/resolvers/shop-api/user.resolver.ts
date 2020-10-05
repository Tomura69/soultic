import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Inject } from 'typedi'

import { User } from '../../../entities/user/user.entity'
import { UserService } from '../../../service/services/user.service'
import { MyContext } from '../../../types/MyContext'
import { LoginInput } from '../../inputs/user/login.input'
import { MeInput } from '../../inputs/user/me.input'
import { RegisterInput } from '../../inputs/user/register.input'
import { IsAuth } from '../../middleware/decorators/IsAuth'

@Resolver()
export class UserResolver {
  @Inject()
  private readonly userService: UserService

  @Mutation(() => User)
  async register(@Arg('input') input: RegisterInput) {
    return this.userService.register(input)
  }

  @Mutation(() => User, { nullable: true })
  async login(@Arg('input') input: LoginInput) {
    return this.userService.login(input)
  }

  @IsAuth()
  @Query(() => User, { nullable: true })
  me(@Ctx() ctx: MyContext) {
    return ctx.user
  }

  @IsAuth()
  @Mutation(() => User, { nullable: true })
  async updateMe(@Arg('input') input: MeInput, @Ctx() ctx: MyContext) {
    return this.userService.update(ctx.user!.id, input)
  }

  @IsAuth()
  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: MyContext) {
    ctx.session.destroy(() => {})
    return true
  }
}
