import { EntityRepository, Repository } from 'typeorm'
import { Service } from 'typedi'
import { ProductVariant } from '../entities/ProductVariant'

@Service()
@EntityRepository(ProductVariant)
export class ProductVariantRepo extends Repository<ProductVariant> {}
