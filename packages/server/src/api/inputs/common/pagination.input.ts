import { InputType, Field, Int } from 'type-graphql';

@InputType({ isAbstract: true })
export abstract class PaginationInput {
  @Field(() => Int)
  take: number;

  @Field(() => Int)
  skip: number;
}
