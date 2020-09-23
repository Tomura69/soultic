import { Field, InputType } from 'type-graphql'
import { SortOperators } from '../../../shared/graphql/inputs/sort-operators.input'

@InputType()
export class UserSortParameters {
  @Field(() => SortOperators, { nullable: true })
  id?: SortOperators

  @Field(() => SortOperators, { nullable: true })
  createdAt?: SortOperators

  @Field(() => SortOperators, { nullable: true })
  updatedAt?: SortOperators

  @Field(() => SortOperators, { nullable: true })
  deletedAt?: SortOperators
}
