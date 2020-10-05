import { registerEnumType } from 'type-graphql'

export enum SortOperators {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(SortOperators, {
  name: 'SortOperators',
})
