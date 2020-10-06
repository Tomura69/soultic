import { Field, ObjectType } from 'type-graphql'
import { Column, Entity, Index, ManyToOne } from 'typeorm'

import { LanguageCode } from '../../api/types/languageCode'
import { Translation } from '../../types/Translation'
import { Base } from '../base/base.entity'
import { Facet } from './facet.entity'

@ObjectType()
@Entity()
@Index(['languageCode', 'base'], { unique: true })
export class FacetTranslation
  extends Base
  implements Translation<Omit<Facet, 'code'>> {
  @Field(() => LanguageCode)
  @Column()
  languageCode: LanguageCode

  @Field()
  @Column()
  name: string

  @ManyToOne(() => Facet, (facet) => facet.translations)
  base: Facet
}
