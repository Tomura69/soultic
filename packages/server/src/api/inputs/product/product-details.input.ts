import { Field, InputType } from 'type-graphql'
import { LanguageCode } from '../../types/languageCode'

@InputType()
export class ProductInput {
  @Field()
  title: string

  @Field(() => LanguageCode, { nullable: true })
  languageCode?: LanguageCode
}
