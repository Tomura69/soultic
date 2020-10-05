import { Field, InputType } from 'type-graphql'
import { ProductTranslation } from '../../../entities/product/product-translation.entity'
import { LanguageCode } from '../../types/languageCode'

@InputType()
export class ProductTranslationInput implements Partial<ProductTranslation> {
  @Field(() => LanguageCode)
  languageCode: LanguageCode

  @Field()
  title: string

  @Field({ nullable: true })
  description: string
}
