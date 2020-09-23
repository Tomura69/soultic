import { Resolver, Mutation, Arg, Ctx } from 'type-graphql'
import { LoginInput } from '../../shared/graphql/inputs/login.input'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { UserRepo } from '../../../repositories/UserRepo'
import * as bcrypt from 'bcryptjs'
import { MyContext } from '../../../types/MyContext'
import { staff } from '../../shared/types/staff'
import { timeStamp } from 'console'

@Resolver()
export class AdminLoginResolver {
  @InjectRepository()
  private userRepo: UserRepo

  @Mutation(() => Boolean, { nullable: true })
  async login(
    @Arg('input') { email, password }: LoginInput,
    @Ctx() ctx: MyContext
  ): Promise<Boolean | undefined> {
    // Avoid brute force
    await new Promise((res) =>
      setTimeout(() => {
        res(true)
      }, 2000)
    )

    const user = await this.userRepo.findOne({ email })
    if (!user) return
    if (!user.roles.some((role) => staff.includes(role))) return

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return

    ctx.session.userId = user.id

    return true
  }
}
