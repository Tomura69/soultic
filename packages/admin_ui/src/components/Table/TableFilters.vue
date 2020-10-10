<template>
  <span>
    <v-dialog v-model="filterDialog.show" max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          class="mr-5"
          @click="filterDialog.prepare()"
          dark
          v-bind="attrs"
          v-on="on"
        >
          {{ $t('filter.do-filter') }}
        </v-btn>
      </template>
      <v-card>
        <!-- <v-card-title>
          <span class="headline">{{ $t('filter.many') }}</span>
        </v-card-title> -->
        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <v-col
                  v-for="(filter, index) in filterDialog.data"
                  :key="index"
                >
                  <div class="text-button">{{ filter.text }}</div>
                  <!-- Radial type -->
                  <div v-if="filter.type === 'radial'">
                    <v-radio-group v-model="filter.active">
                      <v-radio
                        v-for="(data, dataIdx) in filter.data"
                        :key="dataIdx"
                        :label="data.text"
                        color="red"
                        :value="dataIdx"
                      ></v-radio>
                    </v-radio-group>
                  </div>
                  <!-- Select date type -->
                  <div v-else-if="filter.type === 'select-date'">
                    <v-row align="baseline">
                      <v-col cols="9">
                        <v-select
                          outlined
                          :placeholder="$t('select')"
                          :items="filter.data"
                          :value="filter.data[filter.active]"
                          return-object
                          :multiple="false"
                          :clearable="filter.clearable === true"
                          @change="
                            (data) => dateDialog.prepare(index, true, data)
                          "
                        >
                          <template v-slot:selection="{ item }">
                            <span>
                              {{ item.text }}
                            </span>
                            <span
                              class="grey--text ml-4 text-button text-truncate"
                              style="white-space: nowrap; overflow: hidden"
                            >
                              {{ selectedDate(filter) }}
                            </span>
                          </template>
                          <v-icon
                            v-if="selectedDate(filter) !== undefined"
                            slot="append-outer"
                            @click="dateDialog.prepare(index)"
                            class="text-h6 mt-1"
                          >
                            mdi-calendar-blank
                          </v-icon>
                        </v-select>
                      </v-col>
                    </v-row>
                  </div>
                  <!-- Select date type -->
                  <div v-else-if="filter.type === 'select'">
                    <v-row align="baseline">
                      <v-col cols="9">
                        <v-select
                          outlined
                          :placeholder="$t('select')"
                          :items="filter.data"
                          :value="filter.data[filter.active]"
                          :multiple="false"
                          :clearable="filter.clearable === true"
                          @change="(t) => onSelectFilterChange(t, index)"
                        >
                          <template v-slot:selection="{ item }">
                            <span>
                              {{ item.text }}
                            </span>
                          </template>
                        </v-select>
                      </v-col>
                    </v-row>
                  </div>
                  <!-- -->
                </v-col>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions
          style="position: sticky; background-color: inherit; bottom: 0"
        >
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            class="px-3"
            text
            @click="filterDialog.show = false"
          >
            {{ $t('close') }}
          </v-btn>
          <v-btn
            color="primary"
            text
            class="px-3 ml-3"
            @click="filterDialog.save()"
          >
            {{ $t('filter.do-filter') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Date dialog -->
    <v-dialog
      v-model="dateDialog.show"
      :persistent="!dateDialog.canCancel"
      width="290px"
    >
      <!-- Date picker -->
      <v-date-picker
        v-model="dateDialog.value"
        scrollable
        :range="dateDialog.range"
        :locale="$t('date.bcp-47')"
        :no-title="true"
        @change="dateDialog.onDateChange()"
      >
        <v-spacer></v-spacer>
        <v-btn
          v-if="dateDialog.canCancel"
          text
          color="primary"
          @click="dateDialog.show = false"
        >
          {{ $t('cancel') }}
        </v-btn>
        <v-btn
          text
          :disabled="!dateDialog.canSave"
          color="primary"
          @click="dateDialog.save()"
        >
          {{ $t('okay') }}
        </v-btn>
      </v-date-picker>
    </v-dialog>
  </span>
</template>

<script lang="ts">
import { defineComponent, reactive } from '@vue/composition-api'
import { TableFilters } from '@/types/Table'
import {
  DynamicFilterOptionData,
  FilterOptions,
  SelectDateFilter,
} from '@/types/Filters'
import { TranslateResult } from 'vue-i18n'

type ChangeFilters = (data: TableFilters) => void

export default defineComponent({
  name: 'TableFilters',
  props: {
    filtersData: {
      type: Array as () => TableFilters,
      required: true,
    },
    changeFilters: {
      type: (Function as unknown) as () => (filtersData: TableFilters) => void,
      required: true,
    },
  },
  setup(props) {
    const filterDialog = reactive<{
      show: boolean
      data: TableFilters
      prepare: () => void
      save: () => void
    }>({
      show: false,
      data: [],
      prepare() {
        this.data = props.filtersData.map((filter) => ({ ...filter }))
      },
      save() {
        props.changeFilters(this.data)
        this.show = false
      },
    })

    const dateDialog = reactive<{
      show: boolean
      index?: number
      value?: string | string[]
      range: boolean
      canCancel: boolean
      canSave: boolean
      save: (index: number) => void
      prepare: (
        index: number,
        resetDate: boolean,
        value?: DynamicFilterOptionData<unknown>
      ) => void
      onDateChange: () => void
    }>({
      value: undefined,
      show: false,
      range: false,
      canCancel: false,
      get canSave() {
        if (!this.value) return false
        if (this.value.length > 1) return true
        return false
      },
      save() {
        this.show = false
        if (typeof this.index === 'number') {
          if (typeof this.value !== 'string' && Array.isArray(this.value))
            this.value.sort(
              (a, b) => new Date(a).getTime() - new Date(b).getTime()
            )

          filterDialog.data[this.index].value = this.value
        }
      },
      prepare(index, resetDate = false, selection) {
        const { data } = filterDialog.data[index] as SelectDateFilter<unknown>

        // When changing selection date must reset
        if (resetDate) {
          if (selection) {
            const idx = data.findIndex(
              (filter) => filter.text === selection.text
            )
            filterDialog.data[index].active = idx
          } else delete filterDialog.data[index].active

          delete filterDialog.data[index].value
          this.value = undefined
        }

        const { active, value } = filterDialog.data[index]

        if (active === undefined) return

        if (typeof active === 'number' && Array.isArray(data)) {
          const filter = data[active]
          this.range = filter.range === true
        } else this.range = false

        if (resetDate || !value) {
          this.canCancel = false
          this.value = undefined
        } else {
          this.canCancel = true
          this.value = value
        }

        this.index = index
        this.show = true
      },
      onDateChange() {
        const { value } = this
        if (
          value &&
          Array.isArray(value) &&
          value.length > 1 &&
          value.every((v) => v === value[0])
        )
          this.value = undefined
      },
    })

    const selectedDate = ({ value, active }: FilterOptions<unknown>) => {
      if (value === undefined || active === undefined) return undefined
      if (typeof value === 'string') return value
      return value.join(' - ')
    }

    const onSelectFilterChange = (text: TranslateResult, index: number) => {
      const { data } = filterDialog.data[index]

      if (!Array.isArray(data)) return

      const filterIndex = data.findIndex((elem) => elem.text === text)
      filterDialog.data[index].active = filterIndex
    }

    return {
      dateDialog,
      filterDialog,
      selectedDate,
      onSelectFilterChange,
    }
  },
})
</script>
