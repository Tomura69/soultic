import _ from 'lodash'
import { QueryFilters } from '@/types/Filters'
import { TableFilters } from '@/types/Table'
import { computed, SetupContext } from '@vue/composition-api'
import useRouter from './useRouter'

const getFiltersData = (
  rawFilters: QueryFilters[],
  filtersData: TableFilters
): TableFilters => {
  return filtersData.map((elem, idx) => {
    const filter = { ...elem }
    const selectedFilter = rawFilters.find(({ index }) => index === idx)
    if (selectedFilter) {
      const { active, value } = selectedFilter
      filter.active = active
      if (value) filter.value = value
    } else {
      delete filter.active
    }
    return filter
  })
}

const isRawFiltersValid = (
  filters: QueryFilters[],
  filtersData: TableFilters
) => {
  return filters.every(({ active, index }) => {
    if (typeof index !== 'number') return false
    if (!filtersData[index]) return false

    const { data } = filtersData[index]
    if (!data) return false
    if (typeof active === 'number' && Array.isArray(data) && data[active])
      return true
    if (typeof active === 'boolean') return true
    return false
  })
}

const getRawFilters = (
  query: Record<string, unknown>,
  filtersData: TableFilters
): QueryFilters[] => {
  const { filters = [] } = query as { filters: QueryFilters[] }

  if (filters.length && isRawFiltersValid(filters, filtersData)) return filters

  const defaultFilters: QueryFilters[] = []

  filtersData.forEach(({ value, active, type }, index) => {
    if (typeof active === 'number') {
      if (type === 'select') {
        if (value) {
          defaultFilters.push({
            index,
            active,
            value,
          })
        }
      }
      if (type === 'radial') {
        defaultFilters.push({ index, active })
      }
    }
  })
  return defaultFilters
}

const getFilters = (rawFilters: QueryFilters[], filtersData: TableFilters) => {
  return _.merge(
    {},
    ...rawFilters.map(({ active, index, value }) => {
      const filterOption = filtersData[index].data
      if (
        typeof active === 'number' &&
        Array.isArray(filterOption) &&
        filterOption[active] !== undefined
      ) {
        if (typeof filterOption[active].filter === 'function') {
          if (value) {
            if (Array.isArray(value))
              return filterOption[active].filter(...value)
            return filterOption[active].filter(value)
          }
          return {}
        }
        return filterOption[active].filter
      }
      return {}
    })
  )
}

const useFilters = (
  root: SetupContext['root'],
  defaultFilters: TableFilters
) => {
  const { changeQuery, currentQuery } = useRouter(root)

  const rawFilters = computed(() =>
    getRawFilters(currentQuery.value, defaultFilters)
  )

  const filters = computed(() => getFilters(rawFilters.value, defaultFilters))

  const filtersData = computed(() =>
    getFiltersData(rawFilters.value, defaultFilters)
  )

  const changeFilters = (newFiltersData: TableFilters) => {
    changeQuery({
      page: 1,
      filters: getRawFilters({}, newFiltersData),
    })
  }

  return { filters, rawFilters, filtersData, changeFilters }
}

export default useFilters
