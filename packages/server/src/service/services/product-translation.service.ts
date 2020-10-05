import { getRepository } from 'typeorm'
import { ProductTranslationUpdateInput } from '../../api/inputs/product/product-translation-update.input'
import { ProductTranslationInput } from '../../api/inputs/product/product-translation.input'
import { ProductTranslation } from '../../entities/product/product-translation.entity'

export class ProductTranslationService {
  private readonly productTranslationRepo = getRepository(ProductTranslation)

  create(productId: number, input: ProductTranslationInput) {
    return this.productTranslationRepo.save({
      base: { id: productId },
      ...input,
    })
  }

  async update(id: number, input: ProductTranslationUpdateInput) {
    const result = await this.productTranslationRepo.update({ id }, input)
    if (!result.affected) return
    return this.productTranslationRepo.findOne({ id })
  }

  delete(id: number) {
    return this.productTranslationRepo.softDelete({ id })
  }

  findAll(productId: number) {
    return this.productTranslationRepo.find({ base: { id: productId } })
  }

  findOne(partialEntity: Partial<ProductTranslation>) {
    return this.productTranslationRepo.findOne(partialEntity)
  }
}
