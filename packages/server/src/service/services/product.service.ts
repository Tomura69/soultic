import { getLocale } from 'i18n'
import { Service } from 'typedi'
import {
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  getRepository,
} from 'typeorm'

import { ProductInput } from '../../api/inputs/product/product-details.input'
import { ProductFilterParameters } from '../../api/inputs/product/product-filter.input'
import { ProductSortParameters } from '../../api/inputs/product/product-sort.input'
import { ProductTranslationInput } from '../../api/inputs/product/product-translation.input'
import { LanguageCode } from '../../api/types/languageCode'
import { listQuery } from '../helpers/list-query/list-query'
import { Product } from '../../entities/product/product.entity'
import { ProductTranslation } from '../../entities/product/product-translation.entity'
import { translateEntity } from '../helpers/translation/translate-entity'
import { createList } from '../helpers/utils/createList'

export const {
  response: ProductList,
  options: ProductListOptions,
} = createList(Product, ProductFilterParameters, ProductSortParameters)

export type ProductList = InstanceType<typeof ProductList>
export type ProductListOptions = InstanceType<typeof ProductListOptions>

@Service()
export class ProductService {
  private readonly productRepo = getRepository(Product)

  async create(input: ProductInput) {
    if (!input.languageCode) input.languageCode = getLocale() as LanguageCode
    const translation = Object.assign(new ProductTranslation(), input)
    const entity = Object.assign(new Product(), { translations: [translation] })
    const product = await this.productRepo.save(entity)
    return translateEntity(product, input.languageCode)
  }

  async delete(conditions: FindConditions<Product>) {
    return this.productRepo.delete(conditions)
  }

  async findOne(
    id: number,
    languageCode?: LanguageCode,
    findOptions: FindOneOptions = { withDeleted: true }
  ) {
    return this.productRepo.findOne(id, findOptions).then((product) => {
      if (!product) return
      return translateEntity(product, languageCode)
    })
  }

  async findBySlug(
    slug: string,
    findOptions: FindManyOptions = { withDeleted: true }
  ) {
    const translation = await getRepository(ProductTranslation)
      .createQueryBuilder('translation')
      .where('slug = :slug', { slug })
      .getRawOne()
    if (!translation) return

    return this.findOne(translation.translation_baseId, undefined, findOptions)
  }

  async findAll(options: ProductListOptions, languageCode?: LanguageCode) {
    return listQuery(Product, options)
      .getManyAndCount()
      .then(([products, totalCount]) => {
        return {
          items: products.map((product) =>
            translateEntity(product, languageCode)
          ),
          totalCount,
        }
      })
  }
}
