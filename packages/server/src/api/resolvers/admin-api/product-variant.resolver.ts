import { Arg, FieldResolver, Int, Mutation, Resolver, Root } from 'type-graphql'
import { Inject } from 'typedi'

import { ProductVariant } from '../../../entities/product/product-variant.entity'
import { FacetValueService } from '../../../service/services/facet-value.service'
import { ProductVariantService } from '../../../service/services/product-variant.service'
import { ProductVariantInput } from '../../inputs/product/product-variant.input'

@Resolver(() => ProductVariant)
export class AdminProductVariantResolver {
  @Inject()
  private readonly productVariantService: ProductVariantService

  @Inject()
  private readonly facetValuesService: FacetValueService

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

  // TODO: Attach data loader and show only read values
  @FieldResolver()
  facetValues(@Root() variant: ProductVariant) {
    return this.facetValuesService.findAll({})
  }
}
