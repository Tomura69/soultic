import { InputType, Field } from 'type-graphql';
// import { RegisterInput } from './register.input';
import { UserDetailsInput } from '../../../shared/graphql/inputs/userdetails.input';

@InputType()
export class MeInput extends UserDetailsInput {
  @Field()
  currentPassword: string;
}
