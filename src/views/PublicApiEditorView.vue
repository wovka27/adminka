<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import FormLayout from '@/layouts/FormLayout.vue'

import useEditorView from '@/composables/app/useEditorView'
import useRefs from '@/composables/app/useRefs'

import { fetchGetPlansMainList } from '@/services/REST/dom_admin/plans_main'
import {
  type IPublicApiItemSettings,
  fetchGetPublicApiItem,
  fetchPostCreatePublicApiItem,
  fetchPutUpdatePublicApiItem
} from '@/services/REST/dom_admin/public_api'

import getHandleBackArgs from '@/helpers/getHandleBackArgs'

const router = useRouter()
const refs = useRefs(
  'complexes-with-houses',
  'margin-groups',
  'real-property-types',
  'merged-price-types',
  'real-property-statuses',
  'flat-properties',
  'api-resource-settings-types',
  'public-scopes'
)

const { apply, is_data_loaded } = useEditorView({
  router,
  back_route_name: 'public_api_list',
  fetchGetEntity: fetchGetPublicApiItem,
  apply: {
    create: {
      fetchCreateEntity: fetchPostCreatePublicApiItem,
      success_message: 'API-ресурс успешно создан'
    },
    update: {
      fetchUpdateEntity: fetchPutUpdatePublicApiItem
    }
  },
  setFormData: (form_data) => {
    name.value = form_data.name || ''
    weight.value = form_data.weight || 500
    show.value = form_data.show
    type.value = form_data.type || ''
    settings.value = {
      ...form_data.settings,
      price: form_data.settings.price?.map((i) => (Array.isArray(i) ? i : [i.type, i.uid])) ?? []
    }
    public_api_url.value = form_data.public_api_url || ''
  },
  getRequestData: () => ({
    name: name.value,
    weight: weight.value,
    show: show.value,
    type: type.value,
    settings: {
      ...settings.value,
      houses: settings.value.houses?.map((i) => (Array.isArray(i) ? i[1] : i)) ?? [],
      price: settings.value.price?.map(([a, b]: any) => ({ type: a, uid: b })) ?? []
    }
  }),
  mount: {
    create: {
      app_header_props: {
        title: `Добавить выгрузку`,
        breadcrumbs: [
          { label: 'Управление API' },
          { label: 'Публичное API', route: getHandleBackArgs('public_api_list') },
          { label: `Добавить выгрузку` }
        ]
      }
    },
    common: {
      app_header_props: ([response_public_api]) => ({
        title: response_public_api.name,
        breadcrumbs: [
          { label: 'Управление API' },
          { label: 'Публичное API', route: getHandleBackArgs('public_api_list') },
          { label: response_public_api.name }
        ]
      }),
      fn: async () => await handleChange()
    }
  }
})

const name = ref('')
const weight = ref('')
const show = ref(false)
const type = ref('')
const public_api_url = ref('')
const settings = ref<Partial<IPublicApiItemSettings>>({
  articles: [],
  flat_properties: [],
  houses: [],
  flat_types: [],
  marginal_groups: [],
  price: [],
  public_scopes: [],
  statuses: []
})

const article_options = ref<string[]>([])
const real_property_types = computed(() => refs.value.real_property_types.map((i) => ({ ...i, is_active: true })))

const is_show_public_scopes = computed(() => type.value === 'resource_settings_plans')
const merged_price_types = computed(() => refs.value.merged_price_types.filter((i) => i.value !== '1C'))

const handleChange = async (house?: any) => {
  settings.value.articles = []

  const response = await fetchGetPlansMainList(
    {
      page_per: 1000000,
      page_current: 1,
      page_last: 1
    },
    { house: [...new Set((house ?? []).map((i: any) => i[1]))] },
    {
      cbPostFetch: null,
      cbPreFetch: null
    }
  )

  article_options.value = [...new Set(response?.payload.map((i) => i.article))] ?? []
}
</script>

<template>
  <FormLayout v-if="is_data_loaded" :apply="apply">
    <PskGridContainer grid-column-count="3">
      <PskGridContainer grid-span="2" grid-column-count="4">
        <PskSwitch v-model="show" label="Активен" />
        <PskInput required type="number" v-model="weight" label="Сортировка(вес)" />
        <PskInput required class="span-2" v-model="name" label="Название" />
      </PskGridContainer>
      <PskGridContainer grid-span="2" grid-column-count="2">
        <PskSelect
          :options="real_property_types"
          v-model="settings.flat_types"
          clearable
          label="Какой тип недвижимости выгружать"
          options_value="value"
          options_label="label"
          multiple
          collapse_tags
        />
        <PskSelect
          :options="refs.api_resource_settings_types"
          options_value="value"
          options_label="label"
          v-model="type"
          label="Тип сущности"
          required
        />
        <PskSelect
          v-if="is_show_public_scopes"
          :options="refs.public_scopes"
          v-model="settings.public_scopes"
          clearable
          collapse_tags
          label="Какую область применения выгружать"
          options_label="label"
          options_value="value"
          multiple
        />
        <PskSelect
          :options="refs.margin_groups"
          v-model="settings.marginal_groups"
          clearable
          label="Какие группы маржинальности выгружать"
          multiple
          collapse_tags
          options_label="label"
          options_value="value"
        />
        <PskSelect
          v-model="settings.statuses"
          :options="refs.real_property_statuses"
          label="Какие статусы выгружать"
          multiple
          collapse_tags
          clearable
        />
        <PskCascader
          v-model="settings.price"
          clearable
          label="Какой тип цены выгружать"
          multiple
          collapse_tags
          :options="merged_price_types"
        />
        <PskCascader
          clearable
          v-model="settings.houses"
          @update:modelValue="handleChange"
          label="ЖК и ГП"
          multiple
          collapse_tags
          :options="refs.complexes_with_houses"
        />
        <PskSelect
          v-model="settings.articles"
          clearable
          label="Артикул"
          multiple
          collapse_tags
          :options="article_options"
        />
        <PskSelect
          v-model="settings.flat_properties"
          :options="refs.flat_properties"
          label="Свойства"
          class="span-2"
          options_label="label"
          clearable
          options_value="value"
          multiple
        />
        <PskCopiedInput
          v-model="public_api_url"
          label="Публичное API"
          v-if="$route.params.uid !== 'create'"
          class="span-2"
        />
      </PskGridContainer>
    </PskGridContainer>
  </FormLayout>
</template>
