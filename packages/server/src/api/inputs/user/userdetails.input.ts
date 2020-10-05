import { Field, InputType } from 'type-graphql'
import { __ } from 'i18n'
import { IsEmail, MaxLength, MinLength } from 'class-validator'
import { PasswordInput } from './password.input'
import { userValidation } from '../../validation/user.validation'
import { IsEmailAlreadyExist } from '../../validation/decorators/isEmailAlreadyExist'
import { IsNotBlank } from '../../validation/decorators/isNotBlank'

@InputType({ isAbstract: true })
export class UserDetailsInput extends PasswordInput {
  @Field({ nullable: true })
  //TODO:   Add check for special chars and numbers
  @MinLength(userValidation.firstname.minLength, {
    message: () =>
      __(
        'validation.firstname-min-length',
        `${userValidation.firstname.minLength}`
      ),
  })
  @MaxLength(userValidation.firstname.maxLength, {
    message: () =>
      __(
        'validation.firstname-max-length',
        `${userValidation.firstname.maxLength}`
      ),
  })
  @IsNotBlank({ message: () => __('validation.firstname-is-not-blank') })
  firstname?: string

  @Field({ nullable: true })
  @MinLength(userValidation.lastname.minLength, {
    message: () =>
      __(
        'validation.lastname-min-length',
        `${userValidation.lastname.minLength}`
      ),
  })
  @MaxLength(userValidation.lastname.maxLength, {
    message: () =>
      __(
        'validation.lastname-max-length',
        `${userValidation.lastname.maxLength}`
      ),
  })
  @IsNotBlank({ message: () => __('validation.lastname-is-not-blank') })
  lastname?: string

  @Field({ nullable: true })
  @IsEmail({}, { message: () => __('validation.is-email') })
  @IsEmailAlreadyExist({
    message: () => __('validation.email-already-exist'),
  })
  email?: string
}
