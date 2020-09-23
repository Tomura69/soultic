import CompositionApi, { ref, computed } from '@vue/composition-api'
import Vue from 'vue'
import apolloClient from '@/vue-apollo'
import ME from '@/graphql/queries/ME'
import { AdminMeQuery } from '@/generated/graphql'

Vue.use(CompositionApi)

type User = AdminMeQuery['me']

const me = ref<User | null>(null)

const setMe = (value: User | null) => {
  me.value = value
}

const meLoading = ref(false)

const getMe = async () => {
  meLoading.value = true
  const response = await apolloClient.query<AdminMeQuery>({
    query: ME,
    errorPolicy: 'ignore',
    fetchPolicy: 'no-cache',
  })

  if (response.data) setMe(response.data.me)

  meLoading.value = false
}

const useMe = () => {
  return {
    me: computed(() => me.value),
    isAuth: computed(() => me.value !== null),
    meLoading,
    setMe,
    getMe,
  }
}

export default useMe
