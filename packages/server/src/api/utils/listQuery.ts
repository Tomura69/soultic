import { Repository } from 'typeorm'
import { SortOperators } from '../shared/graphql/inputs/sort-operators.input'
import { Operators, whereTransformer } from './whereTransformer'

export const listQuery = async <
  Entity,
  ListOptions extends {
    skip: number
    take: number
    sort: { [key in keyof Partial<Entity>]: SortOperators | undefined }
    filter: { [key in keyof Partial<Entity>]: Operators } & {
      withDeleted?: boolean
    }
  }
>(
  repo: Repository<Entity>,
  { skip, take, sort, filter: { withDeleted, ...rawWhere } }: ListOptions
) => {
  const where = whereTransformer(rawWhere)

  const response = await repo.findAndCount({
    where,
    order: sort,
    withDeleted,
    skip,
    take,
  })

  const totalCount = response[1]
  const items = response[0]

  return { items, totalCount }
}
