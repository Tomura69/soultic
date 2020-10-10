<template>
  <div class="product pb-5 px-5">
    <v-row class="px-5 text--caption overline product-language_container">
      <span
        v-for="languageCode in languageCodes"
        :key="languageCode"
        class="text-center text--caption product-language_selection px-7 py-1"
        @click="changeProductLanguage(languageCode)"
        :class="`
          ${
            $route.query.language === languageCode
              ? 'product-language_selected'
              : ''
          }
        `"
      >
        <div>
          {{ $t(`languages.${languageCode}`) }}
        </div>
      </span>
    </v-row>
    <v-card elevation="1" class="pa-3" v-if="product">
      <LoadingOverlay :loading="false" />
      <v-row>
        <v-col cols="6">
          <v-row>
            <v-col>
              <div class="caption grey--text">ID</div>
              <div>{{ product.id }}</div>
            </v-col>
          </v-row>
          <!-- Title & slug -->
          <v-row>
            <v-col>
              <v-text-field
                :label="$t('title')"
                hide-details
                v-model="selectedTranslation.title"
              ></v-text-field>
            </v-col>
            <v-col>
              <div class="d-inline-flex align-center">
                <v-text-field
                  :label="$t('slug')"
                  value="2"
                  hide-details
                  disabled
                  :loading="slugIsLoading"
                  v-model="selectedTranslation.slug"
                ></v-text-field>
                <v-btn icon class="mt-4" small @click="refreshSlug()">
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
              </div>
            </v-col>
          </v-row>
          <!-- Dates -->
          <v-row>
            <v-col>
              <div class="caption grey--text">{{ $t('createdAt') }}</div>
              <div>{{ product.createdAt }}</div>
            </v-col>
            <v-col>
              <div class="caption grey--text">{{ $t('updatedAt') }}</div>
              <div>{{ product.updatedAt }}</div>
            </v-col>
            <v-col>
              <div class="caption grey--text">{{ $t('deletedAt') }}</div>
              <div>
                {{ product.deletedAt || $t('blank') }}
              </div>
            </v-col>
          </v-row>
          <!-- Save translation -->
          <v-row>
            <v-col class="mb-2">
              <v-btn
                color="success"
                :disabled="!isDataChanged"
                @click="createOrUpdateProductTranslation()"
                class="mr-5"
              >
                {{ $t('save') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
        <!-- Assets -->
        <v-col>Maybe assets?</v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import { defineComponent, ref } from '@vue/composition-api'
import { useMutation, useQuery, useResult } from '@vue/apollo-composable'
import PRODUCT from '@/graphql/queries/PRODUCT'
import GENERATE_SLUG from '@/graphql/mutations/GENERATE_PRODUCT_TRANSLATION_SLUG'
import CREATE_PRODUCT_TRANSLATION from '@/graphql/mutations/CREATE_PRODUCT_TRANSLATION'
import useDataMonitor from '@/modules/useDataMonitor'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import {
  GenerateProductTranslationSlugMutation,
  GenerateProductTranslationSlugMutationVariables,
  LanguageCode,
  ProductByIdQuery,
  ProductByIdQueryVariables,
  UpdateOrCreateProductTranslationMutation,
  UpdateOrCreateProductTranslationMutationVariables,
} from '@/generated/graphql'
import { UnwrapArray } from '@/types/Common'
import useRouter from '@/modules/useRouter'

export default defineComponent({
  name: 'Product',
  data() {
    return {
      languageCodes: Object.values(LanguageCode),
    }
  },
  components: { LoadingOverlay },
  setup(props, { root }) {
    // const { addToast } = useToast()
    const { changeQuery } = useRouter(root)

    const {
      refetch: refetchProduct,
      result,
      onResult: onProductResult,
    } = useQuery<ProductByIdQuery, ProductByIdQueryVariables>(
      PRODUCT,
      {
        id: Number(root.$route.params.id),
      },
      { fetchPolicy: 'no-cache' }
    )
    const selectedTranslation = ref<
      UnwrapArray<NonNullable<ProductByIdQuery['product']>['translations']>
    >()

    const { isDataChanged, makeDataEqual, getDataDifference } = useDataMonitor(
      selectedTranslation
    )

    const product = useResult(result, null, (data) => data.product)

    const prepareSelectedTranslation = () => {
      if (product.value) {
        const translation = product.value.translations.find(
          (trans) => trans.languageCode === root.$route.query.language
        )

        selectedTranslation.value = _.merge(
          {},
          translation || { title: '', slug: '' }
        ) as never
        makeDataEqual()
      }
    }

    const changeProductLanguage = (language: LanguageCode) => {
      if (root.$route.query.language !== language) changeQuery({ language })
      prepareSelectedTranslation()
    }

    onProductResult((res) => {
      if (res && res.data && res.data.product) {
        prepareSelectedTranslation()
      }
    })

    /**
     * Slug refresh
     */

    const { mutate: getUniqueSlug, loading: slugIsLoading } = useMutation<
      GenerateProductTranslationSlugMutation,
      GenerateProductTranslationSlugMutationVariables
    >(GENERATE_SLUG)

    const refreshSlug = async () => {
      if (!selectedTranslation.value) return
      const { id, title } = selectedTranslation.value
      const res = await getUniqueSlug({ id, title })
      if (res && res.data && res.data) {
        selectedTranslation.value.slug = res.data.generateProductTranslationSlug
      }
    }

    /**
     * Save action
     */

    const { mutate: createOrUpdateTranslation } = useMutation<
      UpdateOrCreateProductTranslationMutation,
      UpdateOrCreateProductTranslationMutationVariables
    >(CREATE_PRODUCT_TRANSLATION)
    const createOrUpdateProductTranslation = async () => {
      if (!product.value || !selectedTranslation.value) return

      const currentLanguageCode = root.$route.query.language as LanguageCode

      const input = getDataDifference()
      if (!input) return

      if (selectedTranslation.value.id) {
        input.id = selectedTranslation.value.id
      }

      input.languageCode = currentLanguageCode
      await createOrUpdateTranslation({ id: product.value.id, input })

      refetchProduct()
    }

    return {
      product,
      selectedTranslation,
      changeProductLanguage,
      isDataChanged,
      createOrUpdateProductTranslation,
      refreshSlug,
      slugIsLoading,
    }
  },
})
</script>

<style scoped>
.product-language_selection {
  background-color: rgb(240, 240, 240);
  margin-right: 7px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 0;
  border-radius: 5px 5px 0px 0px;
  cursor: pointer;
  opacity: 0.7;
}

.product-language_selected {
  opacity: 1;
  background-color: inherit;
  transition: all 0.3s ease-out;
}
</style>
