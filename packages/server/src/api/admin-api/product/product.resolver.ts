import { Resolver, Mutation, Args } from 'type-graphql'
import { Product } from '../../../entities/Product'
import { ProductRepo } from '../../../repositories/ProductRepo'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Allow } from '../../middleware/decorators/Allow'
import { Permission } from '../../shared/types/permission'
import { __ } from 'i18n'
import { ProductInput } from './input/product.input'

@Resolver()
export class ProductResolver {
  @InjectRepository()
  private readonly productRepo: ProductRepo

  @Allow(Permission.createProduct)
  @Mutation(() => Product)
  async createProduct(
    @Args()
    data: ProductInput
  ): Promise<Product> {
    const entity = Object.assign(new Product(), data)
    return this.productRepo.save(entity)
  }
}
