<template>
  <v-overlay :absolute="true" :opacity="0.1" :value="loading" :z-index="55">
    <v-progress-circular indeterminate size="64"></v-progress-circular>
  </v-overlay>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'LoadingOverlay',
  props: ['loading'],
})
</script>
