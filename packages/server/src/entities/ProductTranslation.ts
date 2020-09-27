import { Field, ObjectType } from 'type-graphql'
import { BeforeInsert, Column, Entity, Index, ManyToOne } from 'typeorm'
import { getUniqueSlug } from '../utils/getUniqueSlug'
import { Product } from './Product'
import { TranslationBase } from './TranslationBase'

@ObjectType({ isAbstract: true })
@Entity()
@Index(['slug'], { unique: true })
export class ProductTranslation extends TranslationBase {
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

  @ManyToOne(() => Product, (product) => product.translations, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  base: Product
}
