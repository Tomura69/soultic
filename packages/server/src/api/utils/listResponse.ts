import { ObjectType, Field, ClassType, Int } from 'type-graphql';

export const ListResponse = <TItem>(TItemClass: ClassType<TItem>) => {
  @ObjectType(`${TItemClass.name}List`)
  class ListResponseClass {
    @Field(() => [TItemClass])
    items: TItem[];

    @Field(() => Int)
    totalCount: number;
  }
  return ListResponseClass;
};
