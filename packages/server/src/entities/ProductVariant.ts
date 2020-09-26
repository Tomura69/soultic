import { Entity, ManyToOne } from 'typeorm'
import { Base } from './Base'
import { Product } from './Product'

@Entity()
export class ProductVariant extends Base {
  @ManyToOne(() => Product, (product) => product.variants)
  product: Product
}
