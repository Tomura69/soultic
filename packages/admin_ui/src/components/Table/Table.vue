<template>
  <v-card class="mb-5" elevation="1">
    <div>
      <v-toolbar flat class="mb-2">
        <v-row justify="space-between" align="center">
          <!-- Search -->
          <Search
            class="col-6 col-xs-3 col-md-3"
            :placeholder="searchOptions.placeholder"
            :on-search="searchOptions.onSearch"
          />
          <div>
            <!-- Filters -->
            <Filters
              :filters-data="currentFiltersData"
              :change-filters="changeFilters"
            />
            <!-- Fields -->
            <Fields :fields.sync="fields" />
          </div>
        </v-row>
      </v-toolbar>
      <v-data-table
        style="border-bottom: 1px solid rgba(0, 0, 0, 0.1)"
        mobile-breakpoint="0"
        must-sort
        :sort-by.sync="options.sortField"
        :sort-desc.sync="options.sortAsc"
        :headers="showableHeaders"
        :header-props="{ sortIcon: 'mdi-arrow-down' }"
        :server-items-length="data.totalCount"
        :items="data.items"
        :loading="loading"
        hide-default-footer
        :loading-text="`${$t('loading')}...`"
        :no-data-text="$t('no-data')"
      >
        <template v-slot:item="{ item, headers }">
          <tr class="text-center">
            <template v-for="(header, index) in headers">
              <!-- Confirmed -->
              <td v-if="header.value === 'confirmed'" :key="index">
                <v-icon
                  small
                  style="display: inline-block"
                  :class="!item.confirmed ? 'red--text' : 'success--text'"
                >
                  mdi-circle
                </v-icon>
              </td>
              <!-- Actions -->
              <td v-else-if="header.value === ''" :key="index">
                <v-btn
                  x-small
                  icon
                  v-if="actions.edit"
                  @click="doAction('edit', item)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>

                <v-btn
                  x-small
                  icon
                  v-if="actions.edit && actions.delete"
                  @click="
                    doAction(
                      item.deletedAt === null ? 'delete' : 'restore',
                      item
                    )
                  "
                  class="ml-1"
                >
                  <v-icon>
                    {{ item.deletedAt === null ? 'mdi-delete' : 'mdi-restore' }}
                  </v-icon>
                </v-btn>
              </td>
              <!-- Blank -->
              <td
                v-else-if="
                  item[header.value] === null ||
                  item[header.value] === undefined
                "
                :key="index"
                class="text-caption grey--text"
              >
                {{ $t('blank') }}
              </td>
              <!-- Item value -->
              <td v-else :key="index">{{ item[header.value] }}</td>
            </template>
          </tr>
        </template>
      </v-data-table>
      <TablePagination
        :items-per-page.sync="options.limit"
        :total-items="data.totalCount"
        :current-page.sync="options.page"
      />
    </div>
  </v-card>
</template>

<script lang="ts">
import { TranslateResult } from 'vue-i18n'
import {
  defineComponent,
  reactive,
  computed,
  watch,
  ref,
} from '@vue/composition-api'
import _ from 'lodash'
import Search from '@/components/Search.vue'
import Fields from '@/components/Table/TableFields.vue'
import Filters from '@/components/Table/TableFilters.vue'
import TablePagination from '@/components/Table/TablePagination.vue'
import { TABLE_FIELDS_PREFIX } from '@/constants'
import { useQuery, useResult } from '@vue/apollo-composable'
import useFilters from '@/modules/useFilters'
import useRouter from '@/modules/useRouter'
import {
  TableHeaders,
  TableOptions,
  TableSearchOptions,
  TableFilters,
} from '@/types/Table'
import { DocumentNode } from 'graphql'
import { Actions, ActionType } from '@/types/Actions'

interface RequestVars {
  options: {
    take: number
    skip: number
    sort: { [key: string]: string }
    filter: object
  }
}

export default defineComponent({
  name: 'Table',
  components: { Search, Fields, Filters, TablePagination },
  props: {
    queryDocument: {
      type: Object as () => DocumentNode,
      required: true,
    },
    headers: {
      type: Array as () => TableHeaders,
      required: true,
    },
    tableOptions: {
      type: Object as () => TableOptions,
      required: true,
    },
    filtersData: {
      type: Array as () => TableFilters,
      required: true,
    },
    searchOptions: {
      type: Object as () => TableSearchOptions,
      required: true,
    },
    actions: {
      type: Object as () => Actions<unknown>,
      default: () => ({} as Actions<unknown>),
    },
  },
  setup(props, { root }) {
    const { currentQuery, changeQuery } = useRouter(root)

    /**
     * Table settings
     */
    const parseOptions = () => {
      const options = {
        page: (currentQuery.value.page as number) || 1,
        limit: (currentQuery.value.limit as number) || props.tableOptions.limit,
      }
      const { sort } = currentQuery.value
      if (typeof sort === 'string' && sort.split('_').length > 1)
        return {
          ...options,
          sortField: sort.split('_')[0],
          sortAsc: sort.split('_')[1] === 'ASC',
        }

      return {
        ...options,
        sortField: props.tableOptions.sortField,
        sortAsc: props.tableOptions.sortAsc,
      }
    }

    const options = reactive({
      ...parseOptions(),
    })

    watch(options, ({ page, limit, sortField, sortAsc }) => {
      changeQuery({
        page,
        limit,
        sort: `${sortField}_${sortAsc ? 'ASC' : 'DESC'}`,
      })
    })

    /**
     * Filters
     */

    const { filters, filtersData, changeFilters } = useFilters(
      root,
      props.filtersData
    )

    // Fetching data

    const searchQuery = computed(() => {
      const {
        searchOptions: { filter },
      } = props
      const search = currentQuery.value.search as string
      if (!search) return {}
      return filter(String(search))
    })

    const requestVars = computed(() => {
      return {
        options: {
          skip: (options.page - 1) * options.limit,
          take: options.limit,
          sort: {
            [options.sortField]: options.sortAsc ? 'ASC' : 'DESC',
          },
          filter: _.merge(filters.value, searchQuery.value),
        },
      }
    })

    const { result, refetch, loading } = useQuery(
      props.queryDocument,
      { ...requestVars.value },
      {
        fetchPolicy: 'cache-and-network',
      }
    )

    const data = useResult(result, { items: [], totalCount: 0 })

    const debouncedRefetch = _.debounce((vars: RequestVars) => {
      refetch(vars)
    }, 100)

    watch(
      () => currentQuery.value,
      () => {
        Object.assign(options, parseOptions())
        debouncedRefetch(requestVars.value)
      }
    )

    /**
     *  Table headers
     */

    const savedFields: { [key: string]: boolean } =
      JSON.parse(localStorage.getItem(TABLE_FIELDS_PREFIX) || '{}')[
        root.$route.path
      ] || {}

    const fields = ref<{
      [key: string]: { value: boolean; text: TranslateResult }
    }>(
      _.merge(
        {},
        ...props.headers.map((header) => {
          const field = header.value

          // Else don't let to hide/select this header
          if (typeof header.selected === 'boolean') {
            return {
              [field]: {
                value:
                  savedFields[field] === undefined
                    ? header.selected
                    : savedFields[field],
                text: header.text,
              },
            }
          }
          return {}
        })
      )
    )

    const showableHeaders = computed(() =>
      props.headers
        .filter(
          (header) =>
            !fields.value[header.value] ||
            fields.value[header.value].value !== false
        )
        .map((header) => {
          return {
            align: 'center',
            class: 'text-no-wrap grey lighten-4',
            sortable: false,
            ...header,
          }
        })
        .concat(
          Object.keys(props.actions).length // Add actions header if actions was passed
            ? [
                {
                  text: '',
                  value: '',
                  class: 'text-no-wrap grey lighten-4',
                  sortable: false,
                  align: 'center',
                  width: 100,
                },
              ]
            : []
        )
    )

    const doAction = async (type: ActionType, item: unknown) => {
      const callback = props.actions[type]
      if (!callback) return

      try {
        loading.value = true
        await callback(item)
        await refetch() // After refetch loading will be set to false
      } catch {
        loading.value = false
      }
    }

    return {
      options,
      showableHeaders,
      data,
      filters,
      currentFiltersData: filtersData,
      changeFilters,
      fields,
      loading,
      doAction,
    }
  },
})
</script>
