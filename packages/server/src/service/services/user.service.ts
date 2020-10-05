import bcrypt from 'bcryptjs'
import { __ } from 'i18n'
import { Service } from 'typedi'
import { FindOneOptions, getConnection, getRepository } from 'typeorm'

import { UserFilterParameters } from '../../api/inputs/user/user-filter.input'
import { LoginInput } from '../../api/inputs/user/login.input'
import { staff } from '../../api/types/staff'
import { User } from '../../entities/user/user.entity'
import { AppError } from '../../utils/AppError'
import { UserSortParameters } from '../../api/inputs/user/user-sort.input'
import { listQuery } from '../helpers/list-query/list-query'
import { RegisterInput } from '../../api/inputs/user/register.input'
import { Token } from '../../entities/token/token.entity'
import { registrationTemplate } from '../../lib/email/templates/Registration'
import { sendEmail } from '../../lib/email/sendEmail'
import { createList } from '../helpers/utils/createList'

export const { response: UserList, options: UserListOptions } = createList(
  User,
  UserFilterParameters,
  UserSortParameters
)

export type UserList = InstanceType<typeof UserList>
export type UserListOptions = InstanceType<typeof UserListOptions>

@Service()
export class UserService {
  private readonly userRepo = getRepository(User)

  async register(input: RegisterInput) {
    input.password = await bcrypt.hash(input.password, 12)

    await getConnection().transaction(async (entityManager) => {
      const { id: userId } = await entityManager.getRepository(User).save(input)

      const { id: tokenId } = await entityManager
        .getRepository(Token)
        .save({ userId, type: 'register' })

      const mailOptions = registrationTemplate(tokenId, input.email)
      sendEmail(mailOptions)
    })

    return true
  }

  async login(
    { email, password }: LoginInput,
    isStaff = false
  ): Promise<User | undefined> {
    if (isStaff)
      await new Promise((res) =>
        setTimeout(() => {
          res(true)
        }, 2000)
      )

    const user = await this.userRepo.findOne({
      where: { email },
      withDeleted: !isStaff,
    })

    if (!user) throw new AppError(__('error.invalid-login'))

    if (isStaff && !user.roles.some((role) => staff.includes(role)))
      throw new AppError(__('error.invalid-login'))

    if (user.deletedAt !== null) throw new AppError(__('error.user-is-deleted'))

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) throw new AppError(__('error.invalid-login'))
    if (!user.confirmed) throw new AppError(__('error.confirm-email'))

    return user
  }

  async update(id: number, data: Partial<User>) {
    const result = await this.userRepo.update({ id }, data)
    if (!result.affected) throw new AppError(__('error.user-doesnt-exist'))

    return this.userRepo.findOne({ id }) as Promise<User>
  }

  async findOne(
    user: Partial<User>,
    options: FindOneOptions<User> = { withDeleted: true }
  ) {
    return this.userRepo.findOne(user, options)
  }

  async findAll(options: UserListOptions) {
    return listQuery(User, options)
      .getManyAndCount()
      .then(([items, totalCount]) => ({ items, totalCount }))
  }
}
