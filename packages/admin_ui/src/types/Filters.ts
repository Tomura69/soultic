import { TranslateResult } from 'vue-i18n'

export type FilterOptions<T> = (
  | RadialFilter<T>
  | CheckboxFilter<T>
  | SelectFilter<T>
  | SelectDateFilter<T>
) & { value?: string | string[] }

export type RadialFilter<T> = {
  text: TranslateResult
  type: 'radial'
  active: number
  data: FilterOptionData<T>[]
}

export type SelectDateFilter<T> = {
  text: TranslateResult
  type: 'select-date'
  active?: number
  value?: string | string[]
  data: DynamicFilterOptionData<T>[]
}

export type SelectFilter<T> = {
  text: TranslateResult
  type: 'select'
  active?: number
  value?: string | string[]
  data: FilterOptionData<T>[]
}

export type CheckboxFilter<T> = {
  text: TranslateResult
  type: 'checkbox'
  active: boolean
  data: FilterOptionData<T>
}

export type FilterOptionData<T> = {
  text: TranslateResult
  filter: T
}

export type DynamicFilterOptionData<T> = {
  text: TranslateResult
  range?: boolean
  filter: (...args: string[]) => T
}

export type QueryFilters = {
  index: number
  active: FilterOptions<any>['active']
  value?: SelectFilter<any>['value']
}
