import { Entity, Column, BeforeInsert, OneToMany } from 'typeorm'
import { ObjectType, Field } from 'type-graphql'
import { Base } from './Base'
import { getUniqueSlug } from '../utils/getUniqueSlug'
import { ProductVariant } from './ProductVariant'

@ObjectType()
@Entity()
export class Product extends Base {
  @Field()
  @Column('text')
  title: string

  @Field()
  @Column('text', { unique: true })
  slug: string

  @BeforeInsert()
  async generateSlug() {
    this.slug = await getUniqueSlug(this.constructor, this.title)
  }

  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants: ProductVariant[]
}
