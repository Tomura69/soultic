import { Resolver, Query, Arg, Mutation, ID, Ctx } from 'type-graphql'
import { User } from '../../../entities/User'
import { UserRepo } from '../../../repositories/UserRepo'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { IsAuth } from '../../middleware/decorators/IsAuth'
import { Allow } from '../../middleware/decorators/Allow'
import { Permission } from '../../shared/types/permission'
import { UserUpdateInput } from './inputs/user-update.input'
import { __ } from 'i18n'
import { AppError } from '../../../utils/AppError'
import { MyContext } from '../../../types/MyContext'
import { ListResponse } from '../../utils/listResponse'
import { ListOptions } from '../../utils/listOptions'
import { UserFilterParameters } from './inputs/user-filter.input'
import { UserSortParameters } from './inputs/user-sort.input'
import { listQuery } from '../../utils/listQuery'

const UserList = ListResponse<User>(User)
type UserList = InstanceType<typeof UserList>

const UserListOptions = ListOptions<UserFilterParameters, UserSortParameters>(
  UserFilterParameters,
  UserSortParameters,
  'User'
)
type UserListOptions = InstanceType<typeof UserListOptions>

@Resolver()
export class UserResolver {
  @InjectRepository()
  private readonly userRepo: UserRepo

  @IsAuth()
  @Allow(Permission.getUsers)
  @Query(() => UserList)
  async users(
    @Arg('options')
    data: UserListOptions
  ): Promise<UserList> {
    return listQuery(this.userRepo, data)
  }

  @IsAuth()
  @Allow(Permission.getUser)
  @Query(() => User, { nullable: true })
  async user(@Arg('id', () => ID) id: number): Promise<User | undefined> {
    return this.userRepo.findOne(id, { withDeleted: true })
  }

  @IsAuth()
  @Allow(Permission.updateUser)
  @Mutation(() => Boolean)
  async updateUser(
    @Arg('id', () => ID) id: number,
    @Arg('input') input: UserUpdateInput,
    @Ctx() ctx: MyContext
  ): Promise<Boolean> {
    if (id == ctx.user!.id) {
      if (input.deletedAt !== null)
        throw new AppError(__('error.cant-update-yourself'))
    }

    const result = await this.userRepo.update({ id }, input)
    if (!result.affected) throw new AppError(__('error.user-doesnt-exist'))
    return true
  }

  // @IsAuth()
  // @Allow(Permission.deleteUser)
  // @Mutation(() => Boolean)
  // async deleteUser(@Arg('id', () => ID) id: number, @Ctx() ctx: MyContext) {
  //   if (id == ctx.session.userId)
  //     throw new AppError(__('error.cant-delete-yourself'))

  //   const result = await this.userRepo.softDelete({ id })
  //   if (!result.affected) throw new AppError(__('error.user-doesnt-exist'))
  //   return true
  // }

  // @IsAuth()
  // @Allow(Permission.restoreUser)
  // @Mutation(() => Boolean)
  // async restoreUser(@Arg('id', () => ID) id: number) {
  //   const result = await this.userRepo.restore({ id })
  //   if (!result.affected) throw new AppError(__('error.user-doesnt-exist'))
  //   return true
  // }
}
