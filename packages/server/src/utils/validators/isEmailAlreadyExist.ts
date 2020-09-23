import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserRepo } from '../../repositories/UserRepo';
import { InjectRepository } from 'typeorm-typedi-extensions';

@ValidatorConstraint({ async: true })
export class isEmailAlreadyExist implements ValidatorConstraintInterface {
  @InjectRepository()
  private readonly userRepo: UserRepo;

  async validate(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });

    if (user) return false;
    return true;
  }
}

export function IsEmailAlreadyExist(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: isEmailAlreadyExist,
    });
  };
}
