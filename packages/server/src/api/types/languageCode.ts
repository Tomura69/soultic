import { registerEnumType } from 'type-graphql'

export enum LanguageCode {
  lt = 'lt',
  en = 'en',
}

registerEnumType(LanguageCode, {
  name: 'LanguageCode',
  description: 'Available language codes',
})
