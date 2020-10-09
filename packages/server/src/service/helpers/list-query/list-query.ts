import { SortOperators } from '../../../api/inputs/operators/sort-operators.input'
import { Base } from '../../../entities/base/base.entity'
import { IEntity } from '../../../types/IEntity'
import { loadEager } from './load-eager'
import { getColumnMetadata } from './get-column-metadata'
import { StringOperators } from '../../../api/inputs/operators/string-operators.input'
import { DateOperators } from '../../../api/inputs/operators/date-operators.input'
import { BoolOperators } from '../../../api/inputs/operators/bool-operators.input'

export type Operators =
  | StringOperators
  | DateOperators
  | BoolOperators
  | SortOperators

type ListQueryOptions<T> = {
  skip: number
  take: number
  sort: { [key in keyof Partial<T>]: SortOperators | undefined }
  filter: { [key in keyof Partial<T>]: Operators | undefined } & {
    withDeleted?: boolean
  }
}

type ExtendedListQueryOptions = {
  relations?: string[]
  withDeleted?: boolean
}

type WhereCondition = {
  clause: string
  parameters: { [param: string]: string | string[] | number }
}

export const listQuery = <T extends Base>(
  entity: IEntity<T>,
  options: ListQueryOptions<T>,
  extendedOptions: ExtendedListQueryOptions = { withDeleted: true }
) => {
  const filters = parseFilters(entity, options.filter)

  const qb = loadEager(entity, {
    take: options.take,
    skip: options.skip,
    order: options.sort,
    ...extendedOptions,
  })

  filters.forEach(({ clause, parameters }) => {
    qb.andWhere(clause, parameters)
  })

  return qb
}

const parseFilters = <T extends Base>(
  entity: IEntity<T>,
  input: ListQueryOptions<any>['filter']
) => {
  const { columns, relationsData, alias } = getColumnMetadata(entity)

  const filters = []

  let argIndex = 1
  for (const [key, operation] of Object.entries(input)) {
    if (operation) {
      for (const [operator, value] of Object.entries(operation)) {
        let fieldName: string

        // Getting proper field name
        if (columns.find((c) => c.propertyName === key)) {
          fieldName = `${alias}.${key}`
        } else {
          const relation = relationsData.find((rc) =>
            rc.columns.find((r) => r.propertyName === key)
          )

          if (relation) {
            fieldName = `${alias}_${relation.name}.${key}`
          } else {
            throw new Error('list-query')
          }
        }

        // Filter where translation is missing
        if (key === 'languageCode') {
          if (operator === 'in' || operator === 'nin') {
            const condition = buildWhereCondition(
              `${alias}.id`,
              operator,
              `select "id" from ${alias}
              where "id" not in (select "baseId" from product_translation
              group by "baseId"
              having not array_agg("languageCode") && array[${value
                .map((val: string) => `'${val}'`)
                .join(',')}]::varchar[])`,
              argIndex
            )
            filters.push(condition)
          }
        }

        const condition = buildWhereCondition(
          fieldName,
          operator,
          value,
          argIndex
        )

        filters.push(condition)
        argIndex++
      }
    }
  }
  return filters
}

const buildWhereCondition = (
  fieldName: string,
  operator: string,
  value: any,
  argIndex: number
): WhereCondition => {
  switch (operator) {
    case 'nin':
      // SubQuery
      if (!Array.isArray(value))
        return {
          clause: `${fieldName} NOT IN (${value})`,
          parameters: {},
        }
      if (value.length)
        return {
          clause: `${fieldName} NOT IN (${value
            .map((val) => (typeof val === 'string' ? `'${val}'` : val))
            .join(',')})`,
          parameters: {},
        }
    case 'in':
      // SubQuery
      if (!Array.isArray(value))
        return {
          clause: `${fieldName} IN (${value})`,
          parameters: {},
        }
      if (value.length)
        return {
          clause: `${fieldName} IN (${value.map((val) =>
            typeof val === 'string' ? `'${val}'` : val
          )})`,
          parameters: {},
        }
    case 'eq':
      if (value === null)
        return {
          clause: `${fieldName} IS NULL`,
          parameters: {},
        }
      return {
        clause: `${fieldName} = :arg${argIndex}`,
        parameters: { [`arg${argIndex}`]: value },
      }
    case 'neq':
      if (value === null)
        return {
          clause: `${fieldName} IS NOT NULL`,
          parameters: {},
        }
      return {
        clause: `${fieldName} != :arg${argIndex}`,
        parameters: { [`arg${argIndex}`]: value },
      }
    case 'contains':
      return {
        clause: `${fieldName} ILIKE :arg${argIndex}`,
        parameters: { [`arg${argIndex}`]: `%${value.trim()}%` },
      }
    case 'after':
      return {
        clause: `${fieldName} > :arg${argIndex}`,
        parameters: { [`arg${argIndex}`]: value },
      }
    case 'before':
      return {
        clause: `${fieldName} < :arg${argIndex}`,
        parameters: { [`arg${argIndex}`]: value },
      }
  }
  return { clause: '1', parameters: {} }
}
