import { getLocale } from 'i18n'
import { LanguageCode } from '../../../api/types/languageCode'
import { DEFAULT_LANGUAGE_CODE } from '../../../constants/DEFAULT_LANGUAGE_CODE'
import { Base } from '../../../entities/base/base.entity'
import { Translatable, Translated } from '../../../types/Translation'

export const translateEntity = <Entity extends Translatable>(
  entity: Entity,
  languageCode: LanguageCode = getLocale() as LanguageCode
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

  for (const [key, value] of Object.entries(translation || {})) {
    if ((key !== 'base' && !(key in Base)) || key === 'name') {
      translated[key] = value
    }
  }

  return translated
}
