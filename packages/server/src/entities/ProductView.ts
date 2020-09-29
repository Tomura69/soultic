import { Field, ObjectType } from 'type-graphql'
import { BaseEntity, Index, ViewColumn, ViewEntity } from 'typeorm'
import { LanguageCode } from '../api/shared/types/languageCode'
import { Product } from './Product'
import { ProductTranslation } from './ProductTranslation'

@ObjectType()
@ViewEntity({
  expression: `
SELECT product.*, "product_translation"."languageCode", "product_translation"."title", "product_translation"."slug" FROM product
LEFT JOIN "product_translation" ON "product_translation"."baseId" = product.id
`,
})
export class ProductView
  extends BaseEntity
  implements
    Omit<Product, 'variants' | 'translations'>,
    Omit<ProductTranslation, 'base' | 'generateSlug'> {
  @Field()
  @ViewColumn()
  id: number

  @Field()
  @ViewColumn()
  createdAt: string

  @Field()
  @ViewColumn()
  deletedAt: string

  @Field()
  @ViewColumn()
  updatedAt: string

  @Field(() => LanguageCode)
  @ViewColumn()
  languageCode: LanguageCode

  @Field()
  @ViewColumn()
  slug: string

  @Field()
  @ViewColumn()
  title: string
}
