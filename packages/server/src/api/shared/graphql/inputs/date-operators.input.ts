import { InputType, Field } from 'type-graphql'

@InputType()
export class DateOperators {
  @Field({ nullable: true })
  before?: Date

  @Field({ nullable: true })
  after?: Date

  @Field({ nullable: true })
  neq?: Date
}
