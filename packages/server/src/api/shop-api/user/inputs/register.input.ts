import { InputType, Field } from 'type-graphql';
import { __ } from 'i18n';
import { UserDetailsInput } from '../../../shared/graphql/inputs/userdetails.input';

@InputType()
export class RegisterInput extends UserDetailsInput {
  @Field()
  firstname: string;

  @Field()
  lastname: string;

  @Field()
  email: string;

  @Field()
  password: string;
}
