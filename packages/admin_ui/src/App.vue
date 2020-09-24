<template>
  <v-app>
    <TheToasts />
    <!-- App -->
    <component :is="layout" style="position: relative">
      <v-container style="position: relative" fluid class="my-2">
        <router-view />
      </v-container>
    </component>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'
import TheToasts from '@/components/TheToasts.vue'

import { RouteMetaInformation } from './types/RouteConfig'

export default defineComponent({
  name: 'App',
  components: { TheToasts },
  setup(props, { root }) {
    const meta = computed(() => root.$route.meta as RouteMetaInformation)

    return {
      layout: computed(
        () =>
          `${
            meta.value && meta.value.layout ? meta.value.layout : 'default'
          }-layout`
      ),
    }
  },
})
</script>
