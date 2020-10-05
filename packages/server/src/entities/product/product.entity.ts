import { Entity, OneToMany } from 'typeorm'
import { Base } from '../base/base.entity'
import { ProductVariant } from './product-variant.entity'
import { ProductTranslation } from './product-translation.entity'
import { Field, ObjectType } from 'type-graphql'
import { Translatable } from '../../types/Translation'
import { LanguageCode } from '../../api/types/languageCode'

@ObjectType()
@Entity()
export class Product
  extends Base
  implements Translatable, Omit<ProductTranslation, 'base' | 'generateSlug'> {
  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants: ProductVariant[]

  @Field(() => [ProductTranslation])
  @OneToMany(() => ProductTranslation, (translation) => translation.base, {
    cascade: ['insert'],
    eager: true,
  })
  translations: ProductTranslation[]

  @Field(() => LanguageCode)
  languageCode: LanguageCode

  @Field()
  slug: string

  @Field()
  title: string

  @Field({ nullable: true })
  description: string
}
