import { Field, ObjectType } from 'type-graphql'
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm'

import { Translatable } from '../../types/Translation'
import { Base } from '../base/base.entity'
import { FacetValueTranslation } from './facet-value-translation.entity'
import { Facet } from '../facet/facet.entity'

@ObjectType()
@Entity()
@Index(['code', 'base'], { unique: true })
export class FacetValue extends Base implements Translatable {
  @Field()
  @Column('varchar')
  code: string

  @Field()
  name: string

  @ManyToOne(() => Facet, (facet) => facet.values, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  base: Facet

  @Field(() => [FacetValueTranslation])
  @OneToMany(() => FacetValueTranslation, (translation) => translation.base, {
    eager: true,
    cascade: ['insert'],
  })
  translations: FacetValueTranslation[]
}
