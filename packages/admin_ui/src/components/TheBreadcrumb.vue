<template>
  <v-breadcrumbs :items="breadcrumbs()">
    <template v-slot:item="{ item }">
      <v-breadcrumbs-item
        :to="item.link"
        :disabled="item.link ? false : true"
        :exact="true"
        class="text-uppercase"
      >
        {{ item.name }}
      </v-breadcrumbs-item>
    </template>
  </v-breadcrumbs>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { RouteMetaInformation } from '@/types/RouteConfig'

export default defineComponent({
  name: 'Breadcrumb',
  methods: {
    breadcrumbs() {
      const meta = this.$route.meta as RouteMetaInformation
      const breadcrumbs = (meta.breadcrumbs || []).map((breadcrumb) => {
        if ('genName' in breadcrumb) {
          return { name: breadcrumb.genName(this.$route) }
        }
        return breadcrumb
      })

      return breadcrumbs
    },
  },
})
</script>
