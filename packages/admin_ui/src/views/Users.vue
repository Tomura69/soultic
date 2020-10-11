<template>
  <div class="users">
    <Table
      :headers="headers"
      :table-options="tableOptions"
      :filtersData="filtersData"
      :searchOptions="searchOptions"
      :query-document="USERS"
      :actions="actions"
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
import { Actions } from '@/types/Actions'
import {
  UserFilterParameters,
  User,
  UserSortParameters,
  DeleteUserMutationVariables,
  RestoreUserMutationVariables,
} from '@/generated/graphql'
import baseFilters from '@/shared/baseFilters'
import useRouter from '@/modules/useRouter'
import USERS from '@/graphql/queries/USERS'
import { useMutation } from '@vue/apollo-composable'
import RESTORE_USER from '@/graphql/mutations/RESTORE_USER'
import DELETE_USER from '@/graphql/mutations/DELETE_USER'

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
        selected: true,
        sortable: true,
      },
      {
        text: $t('updatedAt'),
        value: 'updatedAt',
        selected: false,
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
        selected: false,
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
        active: 2,
        data: [
          {
            text: $t('filter.all'),
            filter: {},
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
            filter: { deletedAt: { eq: null } },
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

    const { mutate: deleteUser } = useMutation<
      boolean,
      DeleteUserMutationVariables
    >(DELETE_USER)
    const { mutate: restoreUser } = useMutation<
      boolean,
      RestoreUserMutationVariables
    >(RESTORE_USER)

    const actions: Actions<User> = {
      edit({ id }) {
        root.$router.push(`/users/${id}`)
      },
      async delete({ id }) {
        await deleteUser({ id })
      },
      async restore({ id }) {
        await restoreUser({ id })
      },
    }

    return {
      filtersData,
      headers,
      tableOptions,
      searchOptions,
      USERS,
      actions,
    }
  },
})
</script>
