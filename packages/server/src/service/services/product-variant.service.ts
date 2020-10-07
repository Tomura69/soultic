import { DeepPartial, getRepository } from 'typeorm'

import { ProductVariantInput } from '../../api/inputs/product/product-variant.input'
import { FacetValue } from '../../entities/facet-value/facet-value.entity'
import { ProductVariant } from '../../entities/product/product-variant.entity'

export class ProductVariantService {
  private readonly productVariantRepo = getRepository(ProductVariant)

  create(productId: number, input: ProductVariantInput) {
    const variant = Object.assign(new ProductVariant(), {
      base: { id: productId },
      ...input,
    })
    return this.productVariantRepo.save(variant)
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
}
