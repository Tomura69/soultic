import { EntityRepository, Repository } from 'typeorm'
import { Service } from 'typedi'
import { ProductTranslation } from '../entities/ProductTranslation'

@Service()
@EntityRepository(ProductTranslation)
export class ProductTranslationRepo extends Repository<ProductTranslation> {}
