<template>
  <div class="products">
    <Table
      :headers="headers"
      :table-options="tableOptions"
      :filtersData="filtersData"
      :searchOptions="searchOptions"
      :query-document="PRODUCTS"
      :actions="actions"
    >
      <template v-slot:topbar>
        <AddProduct class="mb-5" />
      </template>
    </Table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import Table from '@/components/Table/Table.vue'
import AddProduct from '@/components/Product/AddProduct.vue'
import {
  TableHeaders,
  TableOptions,
  TableSearchOptions,
  TableFilters,
} from '@/types/Table'
import { Actions } from '@/types/Actions'
import {
  Product,
  ProductSortParameters,
  ProductFilterParameters,
  MutationDeleteProductArgs,
  MutationRestoreProductArgs,
} from '@/generated/graphql'
import baseFilters from '@/shared/baseFilters'
import useRouter from '@/modules/useRouter'
import PRODUCTS from '@/graphql/queries/PRODUCTS'
import { useMutation } from '@vue/apollo-composable'
import DELETE_PRODUCT from '@/graphql/mutations/DELETE_PRODUCT'
import RESTORE_PRODUCT from '@/graphql/mutations/RESTORE_PRODUCT'

export default defineComponent({
  name: 'Products',
  components: { Table, AddProduct },
  setup(props, { root }) {
    const { changeQuery } = useRouter(root)
    const $t = (key: string) => root.$t(key)

    const tableOptions: TableOptions = {
      sortField: 'id',
      sortAsc: true,
      limit: 10,
    }

    const headers: TableHeaders<Product, ProductSortParameters> = [
      {
        text: 'ID',
        value: 'id',
        width: 70,
        sortable: true,
      },
      {
        text: $t('title'),
        value: 'title',
        selected: true,
      },
      { text: $t('slug'), value: 'slug', selected: true },
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
    ]

    const searchOptions: TableSearchOptions<ProductFilterParameters> = {
      placeholder: $t('search-by-slug'),
      onSearch: (value: string) => {
        changeQuery({ page: 1, search: value })
      },
      filter(val) {
        return {
          slug: {
            contains: val,
          },
        }
      },
    }

    const filtersData: TableFilters<ProductFilterParameters> = [
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
        text: $t('filter.by-missing-translation'),
        type: 'select',
        clearable: true,
        data: [
          {
            text: $t('languages.lt'),
            filter: { languageCode: { nin: ['lt'] } },
          },
          {
            text: $t('languages.en'),
            filter: { languageCode: { nin: ['en'] } },
          },
        ],
      },
      baseFilters.createdAt,
      baseFilters.deletedAt,
      baseFilters.updatedAt,
    ]

    const { mutate: deleteProduct } = useMutation<
      boolean,
      MutationDeleteProductArgs
    >(DELETE_PRODUCT)
    const { mutate: restoreProduct } = useMutation<
      boolean,
      MutationRestoreProductArgs
    >(RESTORE_PRODUCT)

    const actions: Actions<Product> = {
      edit({ id, languageCode }) {
        root.$router.push(`/products/${id}?language=${languageCode}`)
      },
      async delete({ id }) {
        await deleteProduct({ id })
      },
      async restore({ id }) {
        await restoreProduct({ id })
      },
    }

    return {
      filtersData,
      headers,
      tableOptions,
      searchOptions,
      PRODUCTS,
      actions,
    }
  },
})
</script>
