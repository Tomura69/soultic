import { Entity, Column, BeforeInsert } from 'typeorm'
import { ObjectType, Field } from 'type-graphql'
import { Base } from './Base'
import { getUniqueSlug } from '../utils/getUniqueSlug'

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
}
