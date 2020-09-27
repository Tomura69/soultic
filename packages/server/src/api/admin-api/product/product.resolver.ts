import { Resolver, Mutation, Args, Arg, Query, ObjectType } from 'type-graphql'
import { Product } from '../../../entities/Product'
import { ProductRepo } from '../../../repositories/ProductRepo'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Allow } from '../../middleware/decorators/Allow'
import { Permission } from '../../shared/types/permission'
import { ProductInput } from './input/product.input'
import { ProductTranslation } from '../../../entities/ProductTranslation'
import { __, getLocale } from 'i18n'
import { ProductTranslationRepo } from '../../../repositories/ProductTranslationRepo'
import { SelectQueryBuilder } from 'typeorm'
import { LanguageCode } from '../../shared/types/languageCode'

@Resolver()
export class ProductResolver {
  @InjectRepository()
  private readonly productRepo: ProductRepo
  @InjectRepository()
  private readonly productTranslationRepo: ProductTranslationRepo

  @Allow(Permission.createProduct)
  @Mutation(() => Product)
  async createProduct(
    @Args()
    { title }: ProductInput
  ): Promise<Product> {
    const entity = new Product()
    const translation = new ProductTranslation()
    // translation.languageCode = getLocale()
    translation.title = title
    entity.translations = [translation]

    return this.productRepo.save(entity)
  }

  @Mutation(() => ProductTranslation)
  async addProductTranslation(
    @Arg('id') id: number,
    @Arg('title') title: string,
    @Arg('languageCode') languageCode: string
  ) {
    const translation = Object.assign(new ProductTranslation(), {
      base: { id },
      title,
      languageCode,
    })

    return this.productTranslationRepo.save(translation)
  }

  @Mutation(() => Boolean)
  async removeProduct(
    @Arg('id')
    id: number
  ) {
    return this.productRepo.delete({ id })
  }

  @Query(() => Product, { nullable: true })
  async product(
    @Arg('id')
    id: number,
    @Arg('languageCode', () => LanguageCode, { nullable: true })
    languageCode: LanguageCode
  ) {
    console.log(languageCode)
    const product = await this.productRepo.findOne({
      join: {
        alias: 'product',
        innerJoinAndSelect: { translations: 'product.translations' },
      },
      where: (qb: SelectQueryBuilder<Product>) => {
        qb.where({
          id,
        })
        if (languageCode)
          qb.andWhere('translations.languageCode=:code', { code: languageCode })
      },
    })

    return product
  }
}
