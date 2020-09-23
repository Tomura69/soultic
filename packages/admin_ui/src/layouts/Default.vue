<template>
  <div>
    <NavBar />
    <v-main class="mx-4 mb-4">
      <Breadcrumb />

      <slot />
    </v-main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import Breadcrumb from '@/components/TheBreadcrumb.vue'
import NavBar from '@/components/TheNavBar.vue'

export default defineComponent({
  components: {
    NavBar,
    Breadcrumb,
  },
})
</script>
