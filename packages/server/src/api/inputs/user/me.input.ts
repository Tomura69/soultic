import { InputType, Field } from 'type-graphql'
import { UserDetailsInput } from './user-details.input'

@InputType()
export class MeInput extends UserDetailsInput {
  @Field()
  currentPassword: string
}
