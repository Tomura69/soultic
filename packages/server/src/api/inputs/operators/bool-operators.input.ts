import { InputType, Field } from 'type-graphql';

@InputType()
export class BoolOperators {
  @Field({ nullable: true })
  eq: Boolean;
}
