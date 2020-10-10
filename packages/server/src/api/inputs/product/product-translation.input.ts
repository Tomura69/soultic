import { Field, InputType, Int } from 'type-graphql'

import { Base } from '../../../entities/base/base.entity'
import { ProductTranslation } from '../../../entities/product/product-translation.entity'
import { LanguageCode } from '../../types/languageCode'

@InputType()
export class ProductTranslationInput
  implements
    Omit<ProductTranslation, keyof Base | 'generateSlug' | 'base' | 'slug'> {
  @Field(() => LanguageCode)
  languageCode: LanguageCode

  @Field()
  title: string

  @Field({ nullable: true })
  description: string
}
