import { Field, ObjectType } from 'type-graphql'
import { BeforeInsert, Column, Entity, Index, ManyToOne } from 'typeorm'

import { LanguageCode } from '../../api/types/languageCode'
import { Translation } from '../../types/Translation'
import { getUniqueSlug } from '../../utils/getUniqueSlug'
import { Base } from '../base/base.entity'
import { Product } from './product.entity'

@ObjectType()
@Entity()
@Index(['languageCode', 'base'], { unique: true })
export class ProductTranslation extends Base implements Translation<Product> {
  @Field(() => LanguageCode)
  @Column()
  languageCode: LanguageCode

  @Field()
  @Column('text')
  title: string

  @Field()
  @Column('text', { unique: true })
  slug: string

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  description: string

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
