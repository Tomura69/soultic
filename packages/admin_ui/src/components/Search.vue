<template>
  <v-col>
    <v-text-field
      :value="searchInput"
      @input="changeSearch"
      hide-details
      append-icon="mdi-magnify"
      :placeholder="placeholder"
      single-line
    ></v-text-field>
  </v-col>
</template>

<script lang="ts">
import { defineComponent, watch } from '@vue/composition-api'
import useSearch from '@/modules/useSearch'

export default defineComponent({
  props: {
    placeholder: {
      type: String,
      required: true,
    },
    onSearch: {
      type: Function,
      required: true,
    },
  },
  name: 'Search',
  setup(props, { root }) {
    const { searchInput, changeSearch } = useSearch(
      props.onSearch,
      root.$route.query.search as string,
      500
    )

    watch(
      () => root.$route.query,
      ({ search }) => {
        if (!search) searchInput.value = ''
      }
    )

    return { searchInput, changeSearch }
  },
})
</script>
