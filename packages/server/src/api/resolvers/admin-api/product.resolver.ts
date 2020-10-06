import { Resolver, Mutation, Arg, Query, Int } from 'type-graphql'
import { Product } from '../../../entities/product/product.entity'
import { Allow } from '../../middleware/decorators/Allow'
import { Permission } from '../../types/permission'
import { ProductInput } from '../../inputs/product/product-details.input'
import { ProductTranslation } from '../../../entities/product/product-translation.entity'
import { ProductTranslationInput } from '../../inputs/product/product-translation.input'
import { Inject } from 'typedi'
import {
  ProductList,
  ProductListOptions,
  ProductService,
} from '../../../service/services/product.service'
import { ProductTranslationService } from '../../../service/services/product-translation.service'
import { ProductTranslationUpdateInput } from '../../inputs/product/product-translation-update.input'
import { ProductVariantService } from '../../../service/services/product-variant.service'
import { ProductVariant } from '../../../entities/product/product-variant.entity'
import { ProductVariantInput } from '../../inputs/product/product-variant.input'

@Resolver(() => Product)
export class AdminProductResolver {
  @Inject()
  private readonly productService: ProductService

  @Inject()
  private readonly productTranslationService: ProductTranslationService

  @Inject()
  private readonly productVariantService: ProductVariantService

  @Allow(Permission.createProduct)
  @Mutation(() => Product)
  async createProduct(
    @Arg('input')
    input: ProductInput
  ): Promise<Product> {
    return this.productService.create(input)
  }

  @Mutation(() => ProductTranslation)
  async addProductTranslation(
    @Arg('id', () => Int) id: number,
    @Arg('input') input: ProductTranslationInput
  ) {
    return this.productTranslationService.create(id, input)
  }

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

  @Mutation(() => ProductTranslation)
  async updateProductTranslation(
    @Arg('id', () => Int) id: number,
    @Arg('input') input: ProductTranslationUpdateInput
  ) {
    return this.productTranslationService.update(id, input)
  }

  @Mutation(() => Boolean)
  async deleteProductTranslation(@Arg('id', () => Int) id: number) {
    return this.productTranslationService.delete(id)
  }

  @Mutation(() => Boolean)
  async removeProduct(
    @Arg('id', () => Int)
    id: number
  ) {
    return this.productService.delete({ id })
  }

  @Query(() => Product, { nullable: true })
  async product(
    @Arg('slug')
    slug: string
  ) {
    return this.productService.findBySlug(slug)
  }

  @Query(() => ProductList)
  async products(@Arg('options') options: ProductListOptions) {
    return this.productService.findAll(options)
  }
}
