import { Resolver, Mutation, Arg, Query } from 'type-graphql'
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

@Resolver(() => Product)
export class AdminProductResolver {
  @Inject()
  private readonly productService: ProductService

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
    @Arg('id') id: number,
    @Arg('input') input: ProductTranslationInput
  ) {
    return this.productService.addTranslation(id, input)
  }

  @Mutation(() => ProductTranslation)
  async updateProductTranslation(
    @Arg('id') id: number,
    @Arg('input') input: ProductTranslationInput
  ) {
    return this.productService.updateTranslation(id, input)
  }

  @Mutation(() => Boolean)
  async removeProduct(
    @Arg('id')
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
