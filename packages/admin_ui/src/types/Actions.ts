type Action<T> = (item: T, ...args: any[]) => void

export type ActionType = 'edit' | 'delete' | 'restore'

export type Actions<T> = {
  [x in Exclude<ActionType, 'delete' | 'restore'>]?: Action<T>
} &
  (
    | {
        [x in 'delete' | 'restore']?: undefined
      }
    | { [x in 'delete' | 'restore']: Action<T> }
  )
