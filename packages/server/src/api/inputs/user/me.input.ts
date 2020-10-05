import { InputType, Field } from 'type-graphql'
import { UserDetailsInput } from './userdetails.input'

@InputType()
export class MeInput extends UserDetailsInput {
  @Field()
  currentPassword: string
}
