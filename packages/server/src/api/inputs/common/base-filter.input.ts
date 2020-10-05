import { Field, InputType } from 'type-graphql'
import { DateOperators } from '../operators/date-operators.input'

@InputType({ description: 'Base filter parameters' })
export class BaseFilterParamaters {
  @Field({ nullable: true })
  updatedAt?: DateOperators

  @Field({ nullable: true })
  createdAt?: DateOperators

  @Field({ nullable: true })
  deletedAt?: DateOperators
}
