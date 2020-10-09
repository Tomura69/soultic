import { InputType, Field } from 'type-graphql'

@InputType()
export class StringOperators {
  @Field({ nullable: true })
  eq?: string

  @Field({ nullable: true })
  contains?: string;

  @Field(() => [String], { nullable: true })
  in?: string[]

  @Field(() => [String], { nullable: true })
  nin?: string[]
}
