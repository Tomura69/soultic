import { Ctx, FieldResolver, Resolver, Root } from 'type-graphql'
import { Inject } from 'typedi'

import { ProductVariant } from '../../../entities/product/product-variant.entity'
import { ProductVariantService } from '../../../service/services/product-variant.service'
import { MyContext } from '../../../types/MyContext'

@Resolver(() => ProductVariant)
export class ProductVariantEntityResolver {
  @Inject()
  private readonly productVariantService: ProductVariantService

  // TODO: Attach data loader
  @FieldResolver()
  async facetValues(@Root() variant: ProductVariant, @Ctx() ctx: MyContext) {
    return this.productVariantService.getFacetValues(
      variant.id,
      ctx.languageCode
    )
  }
}
