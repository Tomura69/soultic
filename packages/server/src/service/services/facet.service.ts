import { Service } from 'typedi'
import { getRepository } from 'typeorm'

import { FacetTranslationInput } from '../../api/inputs/facet/facet-translation.input'
import { FacetInput } from '../../api/inputs/facet/facet.input'
import { FacetTranslation } from '../../entities/facet/facet-translation.entity'
import { FacetValueTranslation } from '../../entities/facet-value/facet-value-translation.entity'
import { Facet } from '../../entities/facet/facet.entity'
import { translateEntity } from '../helpers/translation/translate-entity'
import { LanguageCode } from '../../api/types/languageCode'

@Service()
export class FacetService {
  private readonly facetRepo = getRepository(Facet)
  private readonly facetTranslationRepo = getRepository(FacetTranslation)

  create({ code, ...input }: FacetInput) {
    const translation = Object.assign(new FacetValueTranslation(), input)
    return this.facetRepo.save({ code, translations: [translation] })
  }

  addTranslation(facetId: number, input: FacetTranslationInput) {
    return this.facetTranslationRepo.save({ base: { id: facetId }, ...input })
  }

  async findAll(languageCode: LanguageCode) {
    return this.facetRepo
      .find()
      .then((facets) =>
        facets.map((facet) => translateEntity(facet, languageCode))
      )
  }
}
