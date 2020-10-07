import { Arg, Int, Mutation, Resolver, Root } from 'type-graphql'
import { Inject } from 'typedi'

import { ProductVariant } from '../../../entities/product/product-variant.entity'
import { ProductVariantService } from '../../../service/services/product-variant.service'
import { ProductVariantInput } from '../../inputs/product/product-variant.input'

@Resolver()
export class AdminProductVariantResolver {
  @Inject()
  private readonly productVariantService: ProductVariantService

  @Mutation(() => ProductVariant)
  async addProductVariant(
    @Arg('id', () => Int) id: number,
    @Arg('input') input: ProductVariantInput
  ) {
    return this.productVariantService.create(id, input)
  }

  @Mutation(() => ProductVariant)
  async updateProductVariant(
    @Arg('id', () => Int) id: number,
    @Arg('input') input: ProductVariantInput
  ) {
    return this.productVariantService.update(id, input)
  }
}
