import { ref, watch } from '@vue/composition-api'
import _ from 'lodash'

type doSearch = (...args: unknown[]) => void

const useSearch = (
  callback?: doSearch,
  searchInitialValue = '',
  timeout = 0
) => {
  const searchInput = ref(searchInitialValue)

  const changeSearch = _.debounce((value: string) => {
    searchInput.value = value
  }, timeout)

  if (callback)
    watch(searchInput, (value) => {
      callback(value.length ? value : undefined)
    })

  return { changeSearch, searchInput }
}

export default useSearch
