import Vue from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'
import VueCompositionApi, { provide } from '@vue/composition-api'
import i18n from '@/plugins/i18n'
import vuetify from '@/plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import apolloClient from './vue-apollo'

import Blank from './layouts/Blank.vue'
import Default from './layouts/Default.vue'
import useMe from './modules/useMe'

Vue.config.productionTip = false

Vue.use(VueCompositionApi)

Vue.component('default-layout', Default)
Vue.component('blank-layout', Blank)

const createApp = async () => {
  // Prefetching user before mounting app
  const { getMe } = useMe()
  await getMe()

  new Vue({
    setup() {
      provide(DefaultApolloClient, apolloClient)
    },
    vuetify,
    i18n,
    router,
    store,
    render: (h) => h(App),
  }).$mount('#app')
}

createApp()
