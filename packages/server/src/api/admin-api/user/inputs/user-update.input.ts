import { InputType, Field } from 'type-graphql'
import { Role } from '../../../shared/types/role'

@InputType()
export class UserUpdateInput {
  @Field(() => [Role], { nullable: true })
  roles?: [Role]

  @Field({ nullable: true })
  confirmed?: Boolean

  @Field({ nullable: true })
  deletedAt?: String
}
