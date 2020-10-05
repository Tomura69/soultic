import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { getRepository } from 'typeorm'

import { User } from '../../../entities/user/user.entity'

@ValidatorConstraint({ async: true })
export class isEmailAlreadyExist implements ValidatorConstraintInterface {
  private readonly userRepo = getRepository(User)

  async validate(email: string) {
    const user = await this.userRepo.findOne({ where: { email } })

    if (user) return false
    return true
  }
}

export function IsEmailAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: isEmailAlreadyExist,
    })
  }
}
