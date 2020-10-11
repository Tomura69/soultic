<template>
  <v-dialog v-model="addProductDialog.show" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="primary"
        outlined
        small
        v-bind="attrs"
        v-on="on"
        @click="addProductDialog.show = true"
      >
        {{ $t('add-new-product') }}
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline text-uppercase">{{ $t('new-product') }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              <v-text-field
                :label="$t('title')"
                v-model="product.title"
                :aria-autocomplete="false"
                required
                hide-details
              ></v-text-field>
            </v-col>
            <v-col>
              <v-select
                :label="$t('language')"
                :items="languages"
                v-model="product.languageCode"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-textarea
                v-model="product.description"
                @input="descriptionInput"
                outlined
                rows="2"
                :label="$t('description')"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          class="px-3"
          text
          @click="addProductDialog.show = false"
        >
          {{ $t('close') }}
        </v-btn>
        <v-btn
          color="primary"
          text
          :loading="loading"
          class="px-3 ml-3"
          @click="addProductDialog.add()"
        >
          {{ $t('add') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive } from '@vue/composition-api'
import { useMutation } from '@vue/apollo-composable'
import {
  CreateProductMutation,
  CreateProductMutationVariables,
  LanguageCode,
  ProductTranslationInput,
} from '@/generated/graphql'
import CREATE_PRODUCT from '@/graphql/mutations/CREATE_PRODUCT'

export default defineComponent({
  name: 'AddProduct',
  setup(props, { root }) {
    const languages = Object.values(LanguageCode).map((code) => ({
      text: root.$t(`languages.${code}`),
      value: code,
    }))

    const product = reactive<ProductTranslationInput>({
      languageCode: root.$i18n.locale as LanguageCode,
      title: '',
      description: null,
    })

    // Reset description to null if value is empty
    const descriptionInput = (value: string) => {
      if (!value) product.description = null
    }

    const { mutate: createProduct, loading } = useMutation<
      CreateProductMutation,
      CreateProductMutationVariables
    >(CREATE_PRODUCT)

    const addProductDialog = reactive({
      show: false,
      async add() {
        const res = await createProduct({ input: product })
        if (res && res.data) {
          const { id, languageCode } = res.data.createProduct
          root.$router.push(`/products/${id}?language=${languageCode}`)
        }
      },
    })

    return { addProductDialog, languages, product, descriptionInput, loading }
  },
})
</script>
