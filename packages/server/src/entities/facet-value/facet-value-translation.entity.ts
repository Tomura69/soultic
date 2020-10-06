import { Field, ObjectType } from 'type-graphql'
import { Column, Entity, Index, ManyToOne } from 'typeorm'

import { LanguageCode } from '../../api/types/languageCode'
import { Translation } from '../../types/Translation'
import { Base } from '../base/base.entity'
import { FacetValue } from './facet-value.entity'

@ObjectType()
@Entity()
@Index(['languageCode', 'base'], { unique: true })
export class FacetValueTranslation
  extends Base
  implements Translation<Omit<FacetValue, 'code'>> {
  @Field(() => LanguageCode)
  @Column()
  languageCode: LanguageCode

  @Field()
  @Column()
  name: string

  @ManyToOne(() => FacetValue, (facet) => facet.translations)
  base: FacetValue
}
