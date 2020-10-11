import {
  DeepPartial,
  FindConditions,
  FindManyOptions,
  getRepository,
} from 'typeorm'

import { ProductVariantInput } from '../../api/inputs/product/product-variant.input'
import { LanguageCode } from '../../api/types/languageCode'
import { FacetValue } from '../../entities/facet-value/facet-value.entity'
import { ProductVariant } from '../../entities/product/product-variant.entity'
import {
  translateDeep,
  translateEntity,
} from '../helpers/translation/translate-entity'

export class ProductVariantService {
  private readonly productVariantRepo = getRepository(ProductVariant)

  create(productId: number, input: ProductVariantInput) {
    const variant = Object.assign(new ProductVariant(), {
      base: { id: productId },
      ...input,
    })
    return this.productVariantRepo.save(variant)
  }

  findAll(options: FindManyOptions<ProductVariant>) {
    return this.productVariantRepo.find(options)
  }

  findOne(input: DeepPartial<ProductVariant>) {
    return this.productVariantRepo.findOne(input)
  }

  async update(id: number, { facetValues, ...input }: ProductVariantInput) {
    return this.productVariantRepo.save({
      id,
      ...input,
      facetValues: facetValues.map((valueId) =>
        Object.assign(new FacetValue(), { id: valueId })
      ),
    })
  }

  async getFacetValues(productVariantId: number, languageCode: LanguageCode) {
    return this.productVariantRepo
      .findOne({
        where: { id: productVariantId },
        relations: ['facetValues', 'facetValues.base'],
      })
      .then((variant) =>
        !variant
          ? []
          : variant.facetValues.map((value) =>
              translateDeep(value, languageCode)
            )
      )
  }
}
