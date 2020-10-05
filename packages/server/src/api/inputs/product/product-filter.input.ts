import { InputType, Field } from 'type-graphql'
import { StringOperators } from '../operators/string-operators.input'
import { BaseFilterParamaters } from '../common/base-filter.input'
import { Product } from '../../../entities/product/product.entity'
import { Operators } from '../../../service/helpers/list-query/list-query'

@InputType()
export class ProductFilterParameters
  extends BaseFilterParamaters
  implements Partial<Record<keyof Product, Operators>> {
  @Field({ nullable: true })
  slug?: StringOperators

  @Field({ nullable: true })
  languageCode?: StringOperators
}
