import { Field, InputType, Int } from 'type-graphql'

import { Base } from '../../../entities/base/base.entity'
import { ProductVariant } from '../../../entities/product/product-variant.entity'

@InputType()
export class ProductVariantInput
  implements
    Omit<
      ProductVariant,
      keyof Base | 'sku' | 'generateSKU' | 'base' | 'facetValues'
    > {
  @Field(() => Int)
  price: number

  @Field(() => [Int])
  facetValues: number[]
}
