import { EntityRepository, Repository } from 'typeorm'
import { Service } from 'typedi'
import { Product } from '../entities/Product'

@Service()
@EntityRepository(Product)
export class ProductRepo extends Repository<Product> {}
