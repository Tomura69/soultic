import { __ } from 'i18n'
import { Inject } from 'typedi'
import { Resolver, Query, Arg, Mutation, Ctx } from 'type-graphql'

import { User } from '../../../entities/user/user.entity'
import { Allow } from '../../middleware/decorators/Allow'
import { Permission } from '../../types/permission'
import { UserUpdateInput } from '../../inputs/user/user-update.input'
import { AppError } from '../../../utils/AppError'
import { MyContext } from '../../../types/MyContext'
import { LoginInput } from '../../inputs/user/login.input'
import {
  UserList,
  UserService,
  UserListOptions,
} from '../../../service/services/user.service'

@Resolver()
export class AdminUserResolver {
  @Inject()
  private readonly userService: UserService

  @Allow(Permission.getUsers)
  @Query(() => UserList)
  async users(@Arg('options') options: UserListOptions): Promise<UserList> {
    return this.userService.findAll(options)
  }

  @Allow(Permission.getUser)
  @Query(() => User, { nullable: true })
  async user(@Arg('id') id: number): Promise<User | undefined> {
    return this.userService.findOne({ id }, { withDeleted: true })
  }

  @Allow(Permission.updateUser)
  @Mutation(() => User, { nullable: true })
  async updateUser(
    @Arg('id') id: number,
    @Arg('input') input: UserUpdateInput,
    @Ctx() ctx: MyContext
  ): Promise<User> {
    if (id === ctx.user!.id)
      throw new AppError(__('error.cant-update-yourself'))

    return this.userService.update(id, input)
  }

  @Mutation(() => User, { nullable: true })
  async login(
    @Arg('input') { email, password }: LoginInput,
    @Ctx() ctx: MyContext
  ): Promise<User | undefined> {
    const user = await this.userService.login({ email, password }, true)

    if (user) ctx.session.userId = user.id
    return user
  }

  @Mutation(() => Boolean)
  logout(@Ctx() ctx: MyContext): Boolean {
    ctx.session.destroy(() => {})
    return true
  }

  @Query(() => User)
  me(@Ctx() ctx: MyContext): User | undefined {
    return ctx.user
  }
}
