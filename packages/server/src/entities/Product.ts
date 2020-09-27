import { Entity, OneToMany } from 'typeorm'
import { ObjectType, Field } from 'type-graphql'
import { Base } from './Base'
import { ProductVariant } from './ProductVariant'
import { ProductTranslation } from './ProductTranslation'

@ObjectType()
@Entity()
export class Product extends Base {
  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants: ProductVariant[]

  @Field(() => [ProductTranslation])
  @OneToMany(() => ProductTranslation, (translation) => translation.base, {
    cascade: ['insert'],
  })
  translations: ProductTranslation[]
}
