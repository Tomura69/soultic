import { Resolver, Mutation, Args, Arg } from 'type-graphql'
import { Product } from '../../../entities/Product'
import { ProductRepo } from '../../../repositories/ProductRepo'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Allow } from '../../middleware/decorators/Allow'
import { Permission } from '../../shared/types/permission'
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

  @Mutation(() => Boolean)
  async removeProduct(
    @Arg('id')
    id: number
  ) {
    return this.productRepo.delete({ id })
  }
}
