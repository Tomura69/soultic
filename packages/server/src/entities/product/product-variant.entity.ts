import _ from 'lodash'
import { __ } from 'i18n'
import { Field, Int, ObjectType } from 'type-graphql'
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  getRepository,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm'

import { AppError } from '../../utils/AppError'
import { Base } from '../base/base.entity'
import { FacetValue } from '../facet-value/facet-value.entity'
import { Product } from './product.entity'
import { translateEntity } from '../../service/helpers/translation/translate-entity'
import { DEFAULT_LANGUAGE_CODE } from '../../constants/DEFAULT_LANGUAGE_CODE'

@ObjectType()
@Entity()
export class ProductVariant extends Base {
  @ManyToOne(() => Product, (product) => product.variants, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  base: Product

  @Field(() => Int)
  @Column('int')
  price: number

  @Field()
  @Column('varchar')
  sku: string

  @Field(() => [FacetValue])
  @ManyToMany(() => FacetValue, { cascade: ['remove', 'update'] })
  @JoinTable()
  facetValues: FacetValue[]

  @BeforeUpdate()
  @BeforeInsert()
  private async generateSku() {
    const productId = this.base.id
    const product = await getRepository(Product).findOne({ id: productId })
    if (!product) throw new AppError(__('error.something-went-wrong'))

    const shortSlug = translateEntity(product, DEFAULT_LANGUAGE_CODE)
      .slug.split('-')
      .map((word) => word[0].toUpperCase())
      .join('')

    const variantsFacets = await getRepository(ProductVariant)
      .find({
        where: { base: { id: productId } },
        withDeleted: true,
        relations: ['facetValues'],
        loadEagerRelations: true,
      })
      .then((variants) =>
        variants.map((variant) => variant.facetValues.map((facet) => facet.id))
      )

    if (
      variantsFacets.some((facetValues) =>
        _.isEqual(facetValues.sort(), this.facetValues.sort())
      )
    ) {
      throw new AppError('Already is')
    }

    this.sku = `${shortSlug}${
      this.facetValues ? '-' + this.facetValues.join('') : ''
    }`
  }
}
