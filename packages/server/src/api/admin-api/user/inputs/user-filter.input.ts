import { InputType, Field } from 'type-graphql'
import { StringOperators } from '../../../shared/graphql/inputs/string-operators.input'
import { BoolOperators } from '../../../shared/graphql/inputs/bool-operators.input'
import { BaseFilterParamaters } from '../../../shared/graphql/inputs/base-filter.input'

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
