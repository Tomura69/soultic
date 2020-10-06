import { Field, InputType } from 'type-graphql'

import { FacetValueTranslation } from '../../../entities/facet-value/facet-value-translation.entity'
import { TranslationInput } from '../../../types/Translation'
import { LanguageCode } from '../../types/languageCode'

@InputType()
export class FacetValueTranslationInput
  implements TranslationInput<FacetValueTranslation> {
  @Field(() => LanguageCode)
  languageCode: LanguageCode

  @Field()
  name: string
}
