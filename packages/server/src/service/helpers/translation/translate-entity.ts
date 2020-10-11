import { getLocale } from 'i18n'
import { LanguageCode } from '../../../api/types/languageCode'
import { DEFAULT_LANGUAGE_CODE } from '../../../constants/DEFAULT_LANGUAGE_CODE'
import { Base } from '../../../entities/base/base.entity'
import { Translatable, Translated } from '../../../types/Translation'

export const translateEntity = <Entity extends Translatable>(
  entity: Entity,
  languageCode: LanguageCode
): Translated<Entity> => {
  const { translations } = entity
  let translation = translations.find((t) => t.languageCode === languageCode)

  // Fallback translation
  if (!translation && languageCode !== DEFAULT_LANGUAGE_CODE) {
    translation = translations.find(
      (t) => t.languageCode === DEFAULT_LANGUAGE_CODE
    )
  }

  // Return first translation if nothing was found
  if (!translation) translation = translations[0]

  const translated = { ...(entity as any) }
  Object.setPrototypeOf(translated, Object.getPrototypeOf(entity))

  for (const [key, value] of Object.entries(translation)) {
    if (
      ['base', 'id', 'updatedAt', 'createdAt', 'deletedAt'].every(
        (prop) => prop !== key
      )
    ) {
      translated[key] = value
    }
  }

  return translated
}

// Translates entity, and entity's nested fields(relations)
export const translateDeep = <Entity extends Translatable>(
  entity: Entity,
  languageCode: LanguageCode,
  maxDeep = 2,
  deepness = 0
) => {
  if (deepness > maxDeep) return entity

  let translated

  try {
    translated = translateEntity(entity, languageCode)
  } catch {
    translated = { ...(entity as any) }
  }

  for (const [key, value] of Object.entries(entity)) {
    if (value instanceof Base) {
      translated[key] = translateDeep(
        value as never,
        languageCode,
        maxDeep,
        deepness + 1
      )
    } else if (
      Array.isArray(value) &&
      value.every(
        (val: any) => val.translations !== undefined && val instanceof Base
      )
    ) {
      translated[key] = value.map((val) =>
        translateDeep(val as never, languageCode, maxDeep, deepness + 1)
      )
    }
  }

  return translated
}
