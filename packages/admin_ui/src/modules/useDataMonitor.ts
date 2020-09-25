import { Ref, ref, watch } from '@vue/composition-api'
import _ from 'lodash'

const useDataMonitor = <Entity>(data: Ref<Entity>) => {
  const originalData = ref()

  const isDataChanged = ref(false)
  const skipChangeCheck = ref(false)

  const makeDataEqual = () => {
    originalData.value = { ...data.value }
    isDataChanged.value = false
  }

  const getDataDifference = () => {
    // type Entity = typeof data.value
    const difference: Partial<Entity> = {}
    if (data.value)
      (Object.keys(data.value) as [keyof Entity]).forEach(
        (key: keyof Entity) => {
          if (data.value && originalData.value) {
            if (!_.isEqual(data.value[key], originalData.value[key]))
              difference[key] = data.value[key]
          }
        }
      )
    return difference
  }

  watch(
    data,
    (newVal, oldVal) => {
      if (!oldVal) {
        originalData.value = { ...newVal }
      }
      if (!skipChangeCheck.value)
        isDataChanged.value = !_.isEqual(originalData.value, newVal)
      skipChangeCheck.value = false
    },
    { deep: true }
  )

  return {
    isDataChanged,
    getDataDifference,
    makeDataEqual,
  }
}

export default useDataMonitor
