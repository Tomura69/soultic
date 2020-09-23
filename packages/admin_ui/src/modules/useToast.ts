import { ref, computed } from '@vue/composition-api'
import { TranslateResult } from 'vue-i18n'

interface Toast {
  id: number
  type: 'success' | 'error'
  message: TranslateResult
  timeout: number
}

type ToastOptions = Pick<Toast, 'type' | 'message'> & {
  timeout?: number
}

const toasts = ref<Toast[]>([])

const useToast = () => {
  const removeToast = (id: number) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  const addToast = ({ type, message, timeout = 5000 }: ToastOptions) => {
    const id =
      Math.max(
        ...(toasts.value.length ? toasts.value.map((elem) => elem.id) : [0])
      ) + 1

    toasts.value.push({
      id,
      type,
      message,
      timeout,
    })
    ;(() => setTimeout(() => removeToast(id), timeout))()
  }

  return { addToast, removeToast, toasts: computed(() => toasts.value) }
}

export default useToast
