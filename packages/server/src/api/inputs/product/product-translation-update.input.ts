import { Field, InputType, Int } from 'type-graphql'
import { LanguageCode } from '../../types/languageCode'
import { ProductTranslationInput } from './product-translation.input'

@InputType()
export class ProductTranslationUpdateInput implements ProductTranslationInput {
  @Field(() => Int, { nullable: true })
  id: number

  @Field({ nullable: true })
  slug: string

  @Field(() => LanguageCode, { nullable: true })
  languageCode: LanguageCode

  @Field({ nullable: true })
  title: string

  @Field({ nullable: true })
  description: string
}
