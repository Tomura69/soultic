import { InputType, Field } from 'type-graphql'
import { StringOperators } from '../operators/string-operators.input'
import { BoolOperators } from '../operators/bool-operators.input'
import { BaseFilterParamaters } from '../common/base-filter.input'

@InputType()
export class UserFilterParameters extends BaseFilterParamaters {
  @Field({ nullable: true })
  email?: StringOperators

  @Field({ nullable: true })
  confirmed?: BoolOperators

  // Option that goes outside { where }
  @Field({ nullable: true })
  withDeleted?: boolean
}
