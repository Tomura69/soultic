<template>
  <v-app>
    <!-- Toasts -->
    <v-snackbar
      v-for="(toast, index) in toasts"
      :key="toast.id"
      :value="true"
      :timeout="-1"
      top
      right
      :color="toast.type"
      :style="`top: ${index * 55}px`"
    >
      <span>{{ toast.message }}</span>
      <template v-slot:action="{ attrs }">
        <v-btn dark text v-bind="attrs" @click="removeToast(toast.id)">
          {{ $t('close') }}
        </v-btn>
      </template>
    </v-snackbar>

    <!-- App -->
    <component :is="layout">
      <v-container fluid class="my-2">
        <router-view />
      </v-container>
    </component>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'
import useToast from '@/modules/useToast'
import { RouteMetaInformation } from './types/RouteConfig'

export default defineComponent({
  name: 'App',
  setup(props, { root }) {
    const meta = computed(() => root.$route.meta as RouteMetaInformation)

    const { toasts, removeToast } = useToast()

    return {
      layout: computed(
        () =>
          `${
            meta.value && meta.value.layout ? meta.value.layout : 'default'
          }-layout`
      ),
      toasts,
      removeToast,
    }
  },
})
</script>
