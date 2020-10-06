import { Field, ObjectType } from 'type-graphql'
import { Column, Entity, Index, OneToMany } from 'typeorm'

import { LanguageCode } from '../../api/types/languageCode'
import { Translatable } from '../../types/Translation'
import { Base } from '../base/base.entity'
import { FacetTranslation } from './facet-translation.entity'
import { FacetValue } from '../facet-value/facet-value.entity'

@ObjectType()
@Entity()
@Index(['code'], { unique: true })
export class Facet extends Base implements Translatable {
  @Field()
  @Column('varchar')
  code: string

  @Field(() => LanguageCode)
  languageCode: LanguageCode

  @Field()
  name: string

  @Field(() => [FacetValue])
  @OneToMany(() => FacetValue, (value) => value.base)
  values: FacetValue[]

  @Field(() => [FacetTranslation])
  @OneToMany(() => FacetTranslation, (translation) => translation.base, {
    eager: true,
    cascade: ['insert'],
  })
  translations: FacetTranslation[]
}
