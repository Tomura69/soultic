import { Field, ObjectType } from 'type-graphql'
import { Column, Entity } from 'typeorm'
import { Base } from './Base'

ObjectType()
Entity()
export class Facet extends Base {
  @Field()
  @Column({ unique: true })
  code: string
}
