<template>
  <div>
    <div class="d-flex align-center justify-space-between py-3 px-10">
      <!-- Items per page -->
      <div class="d-inline-flex align-center mb-1">
        <span class="text-body-2">{{ $t('show') }}</span>
        <span>
          <v-select
            :style="`width: ${String(itemsPerPage).length * 8 + 10}px`"
            class="text-body-2 ml-3 mb-1 text-center"
            :items="itemsPerPageOptions"
            :value="itemsPerPage"
            @change="itemsPerPageChange"
            hide-details
            dense
            height="20"
          >
            <!-- Removing dropdown icon -->
            <div slot="append"></div>
            <div slot="selection" class="text-grey page-limit">
              {{ itemsPerPage }}
            </div>
          </v-select>
        </span>
      </div>
      <!-- Pagination -->
      <div class="d-inline-flex align-center">
        <v-btn
          icon
          :ripple="false"
          :disabled="currentPage === 1"
          @click="updateCurrentPage(1)"
        >
          <v-icon>$first</v-icon>
        </v-btn>
        <v-btn
          icon
          :ripple="false"
          :disabled="!prevPageAvailable(currentPage - 1)"
          @click="updateCurrentPage(currentPage - 1)"
          class="mr-2"
        >
          <v-icon>$prev</v-icon>
        </v-btn>
        <input
          v-model="pageInput"
          @change="updateCurrentPage(pageInput)"
          :style="`width: ${pageInputWidth}px; max-width: 56px`"
          class="px-2 page-input"
          classa="text-center page-input"
        />
        <div class="ml-2" style="opacity: 0.8; font-size: 0.9em">
          <span class="text-lowercase">{{ $t('of') }}</span>
          <span class="ml-1">{{ lastPage }}</span>
        </div>

        <v-btn
          icon
          :ripple="false"
          :disabled="!nextPageAvailable(currentPage + 1)"
          @click="updateCurrentPage(currentPage + 1)"
          class="ml-2"
        >
          <v-icon>$next</v-icon>
        </v-btn>
        <v-btn
          icon
          :ripple="false"
          :disabled="currentPage === lastPage"
          @click="updateCurrentPage(lastPage)"
        >
          <v-icon>$last</v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from '@vue/composition-api'

export default defineComponent({
  name: 'TablePagination',
  props: {
    onChange: {
      type: (Function as unknown) as () => (pagination: {
        page?: number
        limit?: number
      }) => number,
    },
    itemsPerPageOptions: {
      type: Array as () => number[],
      default: () => [1, 10, 20, 40],
    },
    itemsPerPage: {
      type: Number,
      default: 10,
    },
    totalItems: {
      type: Number,
      default: 0,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
  },
  setup(props, { emit }) {
    const pageInput = ref(String(props.currentPage))

    const pageInputWidth = computed(() => {
      return (pageInput.value.length || 1) * 9 + 20
    })

    const lastPage = computed(() => {
      if (props.itemsPerPage && props.totalItems) {
        return Math.ceil(props.totalItems / props.itemsPerPage)
      }
      return 1
    })

    const nextPageAvailable = (page: number) => page <= lastPage.value
    const prevPageAvailable = (page: number) => page > 0

    const updateCurrentPage = (newPage: number | string) => {
      let page: number

      if (typeof newPage === 'string') page = parseInt(newPage, 10)
      else page = newPage

      if (Number.isNaN(page)) page = props.currentPage

      if (
        prevPageAvailable(page) === false ||
        nextPageAvailable(page) === false
      ) {
        if (!nextPageAvailable(page)) page = lastPage.value
        else page = 1
      }

      if (props.currentPage !== page) {
        const { onChange } = props
        if (onChange) onChange({ page })
        emit('update:current-page', page)
      }
      // Page hasn't changed so need to revert pageInput to current page manually
      else pageInput.value = String(page)
    }

    watch(
      () => props.currentPage,
      (value) => {
        pageInput.value = String(value)
      }
    )

    const itemsPerPageChange = (value: number) => {
      const { onChange } = props
      if (onChange) {
        onChange({ page: 1, limit: value })
      }
      emit('update:current-page', 1)
      emit('update:items-per-page', value)
    }

    return {
      lastPage,
      pageInput,
      pageInputWidth,
      updateCurrentPage,
      nextPageAvailable,
      prevPageAvailable,
      itemsPerPageChange,
    }
  },
})
</script>

<style>
.page-input {
  border-radius: 5px;
  border: 2px solid rgba(0, 0, 0, 0.15);
  outline: none;
  transition: all ease-in 75ms;
}

.page-input:focus {
  border-color: #1976d2;
}

.page-limit {
  width: 100%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  white-space: nowrap;
}
</style>
