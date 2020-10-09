import { Service } from 'typedi'
import { FindManyOptions, FindOneOptions, getRepository } from 'typeorm'

import { FacetValueTranslationInput } from '../../api/inputs/facet-value/facet-value-translation'
import { FacetValueInput } from '../../api/inputs/facet-value/facet-value.input'
import { FacetValueTranslation } from '../../entities/facet-value/facet-value-translation.entity'
import { FacetValue } from '../../entities/facet-value/facet-value.entity'
import { translateEntity } from '../helpers/translation/translate-entity'

@Service()
export class FacetValueService {
  private readonly facetValueRepo = getRepository(FacetValue)
  private readonly facetValueTranslationRepo = getRepository(
    FacetValueTranslation
  )

  create(facetId: number, { code, ...input }: FacetValueInput) {
    const translation = Object.assign(new FacetValueTranslation(), input)
    return this.facetValueRepo.save({
      code,
      translations: [translation],
      base: { id: facetId },
    })
  }

  addTranslation(facetValueId: number, input: FacetValueTranslationInput) {
    return this.facetValueTranslationRepo.save({
      base: { id: facetValueId },
      ...input,
    })
  }

  async findAll(options: FindManyOptions<FacetValue>) {
    return this.facetValueRepo
      .find(options)
      .then((facetValues) => facetValues.map((value) => translateEntity(value)))
  }

  async findOne(options: FindOneOptions<FacetValue>) {
    return this.facetValueRepo.findOne(options).then((value) => {
      if (!value) return
      return translateEntity(value)
    })
  }
}
