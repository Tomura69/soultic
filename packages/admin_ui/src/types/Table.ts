import { TranslateResult } from 'vue-i18n'
import { FilterOptions } from './Filters'
import { SortOperators } from './../generated/graphql'

export type TableFilters<T = any> = FilterOptions<T>[]

export type TableHeaders<
  T = any,
  P extends {
    [key in keyof Partial<T>]: SortOperators | null | undefined
  } = any
> = ({
  selected?: boolean
  text: TranslateResult
  width?: number
} & (
  | {
      value: keyof T & string
    }
  | {
      value: keyof T & keyof P & string
      sortable?: boolean
    }
))[]

export type TableOptions = {
  sortField: string
  sortAsc: boolean
  limit: number
}

type PickOne<T> = {
  [P in keyof T]: Record<P, T[P]> &
    Partial<Record<Exclude<keyof T, P>, undefined>>
}[keyof T]

export type TableSearchOptions<T = any> = {
  placeholder: TranslateResult
  onSearch: (...args: any[]) => void
  value?: string
  filter: (...args: any[]) => PickOne<T>
}
