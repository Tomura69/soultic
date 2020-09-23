import { Field, InputType, ClassType } from 'type-graphql'
import { PaginationInput } from '../shared/graphql/inputs/pagination.input'

export const ListOptions = <Filter, Sort>(
  FilterClass: ClassType<Filter>,
  SortClass: ClassType<Sort>,
  enitityName: string
) => {
  @InputType(`${enitityName}ListOptions`)
  class ListOptionsClass extends PaginationInput {
    @Field(() => FilterClass)
    filter: Filter

    @Field(() => SortClass)
    sort: Sort
  }
  return ListOptionsClass
}
