import { Field, ObjectType } from 'type-graphql'
import { Column, Index } from 'typeorm'
import { LanguageCode } from '../api/shared/types/languageCode'
import { Base } from './Base'

@ObjectType({ isAbstract: true })
@Index(['languageCode', 'base'], { unique: true })
export abstract class TranslationBase extends Base {
  @Field(() => LanguageCode)
  @Column()
  languageCode: LanguageCode

  abstract base: unknown
}
