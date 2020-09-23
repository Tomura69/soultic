import { MinLength, Matches } from 'class-validator';
import { Field, InputType, ClassType } from 'type-graphql';
import { userValidation } from '../../../../validation/user.validation';
import { __ } from 'i18n';

@InputType({ isAbstract: true })
export class PasswordInput {
  @Field({ nullable: true })
  @MinLength(userValidation.password.minLength, {
    message: () =>
      __(
        'validation.password-min-length',
        `${userValidation.password.minLength}`
      ),
  })
  @Matches(userValidation.password.matchRegex, {
    message: () => __('validation.password-regex'),
  })
  password?: string;
}
