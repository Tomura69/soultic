<template>
  <div class="users">
    <Table
      :headers="headers"
      :table-options="tableOptions"
      :filtersData="filtersData"
      :searchOptions="searchOptions"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import Table from '@/components/Table/Table.vue'
import {
  TableHeaders,
  TableOptions,
  TableSearchOptions,
  TableFilters,
} from '@/types/Table'
import {
  UserFilterParameters,
  User,
  UserSortParameters,
} from '@/generated/graphql'
import baseFilters from '@/shared/baseFilters'
import useRouter from '@/modules/useRouter'

export default defineComponent({
  name: 'Users',
  components: { Table },
  setup(props, { root }) {
    const { changeQuery } = useRouter(root)
    const $t = (key: string) => root.$t(key)

    const tableOptions: TableOptions = {
      sortField: 'id',
      sortAsc: true,
      limit: 10,
    }

    const headers: TableHeaders<User, UserSortParameters> = [
      {
        text: 'ID',
        value: 'id',
        width: 70,
        sortable: true,
      },
      {
        text: $t('firstname'),
        value: 'firstname',
        selected: true,
      },
      { text: $t('lastname'), value: 'lastname', selected: true },
      { text: $t('email'), value: 'email', selected: true },
      {
        text: $t('createdAt'),
        value: 'createdAt',
        selected: false,
        sortable: true,
      },
      {
        text: $t('updatedAt'),
        value: 'updatedAt',
        selected: true,
        sortable: true,
      },
      {
        text: $t('deletedAt'),
        value: 'deletedAt',
        selected: false,
        sortable: true,
      },
      {
        text: $t('confirmed'),
        value: 'confirmed',
        width: 120,
        selected: true,
      },
    ]

    const searchOptions: TableSearchOptions<UserFilterParameters> = {
      placeholder: $t('search-by-email'),
      onSearch: (value: string) => {
        changeQuery({ page: 1, search: value })
      },
      filter(val) {
        return {
          email: {
            eq: val,
          },
        }
      },
    }

    const filtersData: TableFilters<UserFilterParameters> = [
      {
        text: $t('filter.by-deleted-status'),
        type: 'radial',
        active: 0,
        data: [
          {
            text: $t('filter.all'),
            filter: { withDeleted: true },
          },
          {
            text: $t('filter.deleted'),
            filter: {
              withDeleted: true,
              deletedAt: { neq: null },
            },
          },
          {
            text: $t('filter.not-deleted'),
            filter: { withDeleted: false },
          },
        ],
      },
      {
        text: $t('filter.by-confirmed-status'),
        type: 'radial',
        active: 0,
        data: [
          {
            text: $t('filter.all'),
            filter: {},
          },
          {
            text: $t('filter.confirmed'),
            filter: { confirmed: { eq: true } },
          },
          {
            text: $t('filter.not-confirmed'),
            filter: { confirmed: { eq: false } },
          },
        ],
      },
      baseFilters.createdAt,
      baseFilters.deletedAt,
      baseFilters.updatedAt,
    ]

    return {
      filtersData,
      headers,
      tableOptions,
      searchOptions,
    }
  },
})
</script>
