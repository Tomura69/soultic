import { Inject } from 'typedi'
import { Resolver, Mutation, Arg, Query, Int, Ctx } from 'type-graphql'

import { Product } from '../../../entities/product/product.entity'
import { Allow } from '../../middleware/decorators/Allow'
import { Permission } from '../../types/permission'
import { ProductInput } from '../../inputs/product/product-details.input'
import { ProductTranslation } from '../../../entities/product/product-translation.entity'
import { ProductTranslationInput } from '../../inputs/product/product-translation.input'
import {
  ProductList,
  ProductListOptions,
  ProductService,
} from '../../../service/services/product.service'
import { ProductTranslationService } from '../../../service/services/product-translation.service'
import { ProductTranslationUpdateInput } from '../../inputs/product/product-translation-update.input'
import { AppError } from '../../../utils/AppError'
import { MyContext } from '../../../types/MyContext'

@Resolver(() => Product)
export class AdminProductResolver {
  @Inject()
  private readonly productService: ProductService

  @Inject()
  private readonly productTranslationService: ProductTranslationService

  @Allow(Permission.createProduct)
  @Mutation(() => Product)
  async createProduct(
    @Arg('input')
    input: ProductInput,
    @Ctx() ctx: MyContext
  ): Promise<Product> {
    return this.productService.create(input, ctx.languageCode)
  }

  @Mutation(() => Boolean)
  async deleteProduct(@Arg('id', () => Int) id: number) {
    return this.productService.delete({ id })
  }

  @Mutation(() => Boolean)
  async restoreProduct(@Arg('id', () => Int) id: number) {
    return this.productService.restore({ id })
  }

  @Mutation(() => ProductTranslation)
  async addProductTranslation(
    @Arg('id', () => Int) id: number,
    @Arg('input') input: ProductTranslationInput
  ) {
    return this.productTranslationService.create(id, input)
  }

  @Mutation(() => String)
  async generateProductTranslationSlug(
    @Arg('title') title: string,
    @Arg('id', () => Int, { nullable: true }) id?: number
  ) {
    return this.productTranslationService.generateSlug(title, id)
  }

  @Mutation(() => Boolean)
  async updateOrCreateProductTranslation(
    @Arg('id', () => Int, { nullable: true }) id: number,
    @Arg('input') input: ProductTranslationUpdateInput
  ) {
    if (!id && !input.id)
      throw new AppError('error.need-to-provide-atleast-one-of-ids')

    if (input.id) {
      return this.productTranslationService.update(input.id, input)
    }
    // Create translation
    if (!input.slug)
      input.slug = await this.generateProductTranslationSlug(input.title)
    await this.addProductTranslation(id, input as any)
    return true
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
  async product(@Arg('id', () => Int) id: number, @Ctx() ctx: MyContext) {
    return this.productService.findOne(id, ctx.languageCode)
  }

  @Query(() => ProductList)
  async products(
    @Arg('options') options: ProductListOptions,
    @Ctx() ctx: MyContext
  ) {
    return this.productService.findAll(options, ctx.languageCode)
  }
}
