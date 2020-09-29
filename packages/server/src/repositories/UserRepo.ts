import bcrypt from 'bcryptjs'
import { EntityRepository, Repository } from 'typeorm'
import { User } from '../entities/User'
import { Service } from 'typedi'
import { LoginInput } from '../api/shared/graphql/inputs/login.input'
import { MyContext } from '../types/MyContext'
import { staff } from '../api/shared/types/staff'
import { AppError } from '../utils/AppError'
import { __ } from 'i18n'

@Service()
@EntityRepository(User)
export class UserRepo extends Repository<User> {
  async login(
    { email, password }: LoginInput,
    ctx: MyContext,
    isStaff = false
  ): Promise<User | undefined> {
    if (isStaff)
      await new Promise((res) =>
        setTimeout(() => {
          res(true)
        }, 2000)
      )

    const user = await this.findOne({ where: { email }, withDeleted: !isStaff })

    if (!user) throw new AppError(__('error.invalid-login'))

    if (isStaff && !user.roles.some((role) => staff.includes(role)))
      throw new AppError(__('error.invalid-login'))

    if (user.deletedAt !== null) throw new AppError(__('error.user-is-deleted'))

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) throw new AppError(__('error.invalid-login'))
    if (!user.confirmed) throw new AppError(__('error.confirm-email'))

    ctx.session.userId = user.id

    return user
  }
}
