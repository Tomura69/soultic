import { Field, InputType } from 'type-graphql'
import { FacetTranslation } from '../../../entities/facet/facet-translation.entity'
import { TranslationInput } from '../../../types/Translation'
import { LanguageCode } from '../../types/languageCode'

@InputType()
export class FacetTranslationInput
  implements TranslationInput<FacetTranslation> {
  @Field(() => LanguageCode)
  languageCode: LanguageCode

  @Field()
  name: string
}
