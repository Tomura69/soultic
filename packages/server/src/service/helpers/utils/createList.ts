import { Field, InputType, ClassType, ObjectType, Int } from 'type-graphql'
import { BaseFilterParamaters } from '../../../api/inputs/common/base-filter.input'
import { PaginationInput } from '../../../api/inputs/common/pagination.input'
import { Base } from '../../../entities/base/base.entity'

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

export const ListResponse = <TItem>(TItemClass: ClassType<TItem>) => {
  @ObjectType(`${TItemClass.name}List`)
  class ListResponseClass {
    @Field(() => [TItemClass])
    items: TItem[]

    @Field(() => Int)
    totalCount: number
  }
  return ListResponseClass
}

export const createList = <
  Entity extends Base,
  Filter extends BaseFilterParamaters,
  Sort
>(
  entity: ClassType<Entity>,
  filter: ClassType<Filter>,
  sort: ClassType<Sort>
) => {
  const response = ListResponse(entity)
  const options = ListOptions(filter, sort, entity.name)

  return { response, options }
}
