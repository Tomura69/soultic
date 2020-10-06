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

  async update(id: number, input: ProductVariantInput) {
    const newInput: DeepPartial<ProductVariant> = {
      ...input,
      facetValues: input.facetValues.map((id) =>
        Object.assign(new FacetValue(), { id })
      ),
    }

    const result = await this.productVariantRepo.update({ id }, {})
    if (!result.affected) return

    return this.findOne(newInput)
  }
}
