import { DateOperators } from '../shared/graphql/inputs/date-operators.input'
import { StringOperators } from '../shared/graphql/inputs/string-operators.input'
import { Raw } from 'typeorm'
import { BoolOperators } from '../shared/graphql/inputs/bool-operators.input'

export type Operators = StringOperators | DateOperators | BoolOperators

export const whereTransformer = <T extends { [key in keyof T]: Operators }>(
  rawWhere: T
) => {
  let where: { [key: string]: any } = {}

  Object.keys(rawWhere).forEach((key) => {
    const value = rawWhere[key as keyof T]
    where[key] = Raw((alias) => {
      let query = ''
      if (!alias) return query

      const addCondition = (condition: string, val: unknown) => {
        const value = typeof val === 'string' ? `'${val}'` : val
        if (query.length) query += ` AND `
        query += `${alias} ${condition} ${value}`
      }

      if (value instanceof StringOperators) {
        if (value.eq) {
          addCondition('=', value.eq)
        }
        if (value.contains) {
          addCondition('LIKE', `%${value.contains}%`)
        }
      } else if (value instanceof DateOperators) {
        if (value.after) {
          addCondition('>', value.after.toISOString())
        }
        if (value.before) {
          addCondition('<', value.before.toISOString())
        }
        if (value.neq === null) addCondition('IS NOT', null)
      } else if (value instanceof BoolOperators) {
        addCondition('=', value.eq)
      }
      return query
    })
  })

  return where
}
