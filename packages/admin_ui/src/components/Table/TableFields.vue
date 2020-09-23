<template>
  <v-menu v-model="menu" :close-on-content-click="false" offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        @click="copyFields()"
        color="indigo"
        class="mr-5"
        dark
        v-bind="attrs"
        v-on="on"
      >
        {{ $t('configure') }}
      </v-btn>
    </template>

    <v-card>
      <v-list>
        <div
          v-for="(key, index) in Object.keys(localFields)"
          :key="index"
          class="pr-1"
        >
          <v-checkbox
            class="px-4 mt-2"
            :label="localFields[key].text"
            :input-value="localFields[key].value"
            @click="localFields[key].value = !localFields[key].value"
            hide-details
            color="indigo"
          ></v-checkbox>
        </div>
      </v-list>

      <v-card-actions>
        <v-btn color="primary" class="text--bold" block text @click="save()">
          {{ $t('save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from '@vue/composition-api'
import { TABLE_FIELDS_PREFIX } from '@/constants'
import useToast from '@/modules/useToast'
import _ from 'lodash'

export default defineComponent({
  name: 'TableFields',
  props: {
    fields: {
      type: Object,
      required: true,
    },
  },
  setup(props, { root, emit }) {
    const menu = ref(false)

    const localFields = reactive(_.cloneDeep(props.fields))

    const copyFields = () => {
      Object.assign(localFields, _.cloneDeep(props.fields))
    }

    const save = () => {
      const local = JSON.parse(
        localStorage.getItem(TABLE_FIELDS_PREFIX) || '{}'
      )
      const fields = Object.fromEntries(
        Object.keys(localFields).map((key) => {
          return [key, localFields[key].value]
        })
      )

      local[root.$route.path] = fields

      localStorage.setItem(TABLE_FIELDS_PREFIX, JSON.stringify(local))
      emit('update:fields', _.cloneDeep(localFields))
      menu.value = false

      const { addToast } = useToast()

      addToast({ type: 'success', message: root.$t('changes-saved') })
    }
    return { menu, save, localFields, copyFields }
  },
})
</script>
