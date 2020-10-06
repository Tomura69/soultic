import { LanguageCode } from '../api/types/languageCode'
import { Base } from '../entities/base/base.entity'

export type TranslatableRelationsKeys<T> = {
  [K in keyof T]: K extends 'translations' ? never : K
}[keyof T]

export type TranslatableKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never
}[keyof T]

export type Translation<T> = {
  id: number
  languageCode: LanguageCode
  base: T
} & { [K in TranslatableKeys<T>]: string }

export type Translatable = {
  translations: Translation<Base>[]
}

export type Translated<T> = T & {
  languageCode: LanguageCode
} & { [K in TranslatableRelationsKeys<T>]: string }

export type TranslationInput<T> = {
  [K in TranslatableKeys<T>]: string
}
