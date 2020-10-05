import { Entity, ManyToOne } from 'typeorm'
import { Base } from '../base/base.entity'
import { Product } from './product.entity'

@Entity()
export class ProductVariant extends Base {
  @ManyToOne(() => Product, (product) => product.variants, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  product: Product
}
