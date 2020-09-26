import { ArgsType, Field } from 'type-graphql'

@ArgsType()
export class ProductInput {
  @Field()
  title: string
}
