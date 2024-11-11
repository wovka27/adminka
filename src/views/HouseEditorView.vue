<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import AggregatorsLayout, { type IAggregatorsLayoutProps } from '@/layouts/AggregatorsLayout.vue'
import FormLayout from '@/layouts/FormLayout.vue'

import DefaultFormFields from '@/components/DefaultFormFields.vue'
import HouseAvito from '@/components/House/HouseAvito.vue'
import HouseCian from '@/components/House/HouseCian.vue'
import HouseDomClick from '@/components/House/HouseDomClick.vue'
import HouseM2 from '@/components/House/HouseM2.vue'
import HouseYandex from '@/components/House/HouseYandex.vue'

import useEditorView from '@/composables/app/useEditorView'
import useRefs from '@/composables/app/useRefs'
import useUploadMaterials from '@/composables/app/useUploadMaterials'

import type { IAggregatorItem } from '@/services/REST/dom_admin/common_types'
import { fetchGetHouse, fetchUpdateHouse } from '@/services/REST/dom_admin/house'

import convertDateToRequest from '@/helpers/convertDateToRequest'
import getHandleBackArgs from '@/helpers/getHandleBackArgs'
import getNumString from '@/helpers/getNumString'

const router = useRouter()

const refs = useRefs('house-offer-types', 'company-groups-with-legal-entities')

const { material_type_options, materials, getMaterials, attach, detach, getRequestDataMaterials } =
  useUploadMaterials('house')

const { apply, is_data_loaded, getIsStateBeforeEqualAfter, pushCommonData, default_fields } = useEditorView({
  router,
  fetchGetEntity: fetchGetHouse,
  default_fields: true,
  back_route_name: 'house_list',
  apply: {
    update: {
      fetchUpdateEntity: fetchUpdateHouse,
      beforeResponseFn: async () => {
        const house_uid = router.currentRoute.value.params.uid as string

        await detach(house_uid)
        await attach(house_uid)
      },
      afterResponseFn: async (response) => {
        aggregators_items = response.aggregators_items ? response.aggregators_items.map(getAggregatorItem) : []
      }
    }
  },
  setFormData: (form_data) => {
    getMaterials(form_data.media)

    name.value = form_data.name || ''
    ready_date.value = form_data.ready_date || ''
    title_for_site.value = form_data.title_for_site || ''
    slug.value = form_data.slug || ''
    offer_type.value = form_data.offer_type
    address_fillable.value = form_data.address_fillable || ''
    legal_entity_uid.value = form_data.legal_entity_uid || ''
    floors.value = getNumString(form_data.floors)
    construction_method.value = form_data.construction_method || ''
    sales_start.value = form_data.sales_start ? new Date(form_data.sales_start) : null
    commissioning_before.value = form_data.commissioning_before ? new Date(form_data.commissioning_before) : null
    actual_commissioning_at.value = form_data.actual_commissioning_at
      ? new Date(form_data.actual_commissioning_at)
      : null
    keys_delivery_before.value = form_data.keys_delivery_before ? new Date(form_data.keys_delivery_before) : null
    actual_keys_delivery_at.value = form_data.actual_keys_delivery_at
      ? new Date(form_data.actual_keys_delivery_at)
      : null
  },
  getRequestData: () => ({
    ...getRequestDataMaterials(),

    name: name.value,
    ready_date: ready_date.value,
    title_for_site: title_for_site.value,
    slug: slug.value,
    offer_type: offer_type.value,
    address_fillable: address_fillable.value,
    legal_entity_uid: legal_entity_uid.value,
    floors: +floors.value,
    construction_method: construction_method.value,
    sales_start: sales_start.value ? convertDateToRequest(sales_start.value) : null,
    commissioning_before: commissioning_before.value ? convertDateToRequest(commissioning_before.value) : null,
    actual_commissioning_at: actual_commissioning_at.value ? convertDateToRequest(actual_commissioning_at.value) : null,
    keys_delivery_before: keys_delivery_before.value ? convertDateToRequest(keys_delivery_before.value) : null,
    actual_keys_delivery_at: actual_keys_delivery_at.value ? convertDateToRequest(actual_keys_delivery_at.value) : null
  }),
  mount: {
    common: {
      app_header_props: ([response_house]) => ({
        title: response_house.name,
        breadcrumbs: [
          {
            label: 'Дома',
            route: getHandleBackArgs('house_list')
          },
          { label: response_house.name }
        ]
      }),
      fn: async ([response_house]) => {
        aggregators_items = response_house.aggregators_items?.length
          ? response_house.aggregators_items.map(getAggregatorItem)
          : []
      }
    }
  }
})

const name = ref('')
const ready_date = ref('')
const title_for_site = ref('')
const slug = ref('')
const offer_type = ref()
const address_fillable = ref('')
const legal_entity_uid = ref()
const floors = ref('')
const construction_method = ref('')
const sales_start = ref<Date | null>(null)
const commissioning_before = ref()
const actual_commissioning_at = ref()
const keys_delivery_before = ref()
const actual_keys_delivery_at = ref()

let aggregators_items: IAggregatorsLayoutProps['aggregators'] = []

const getAggregatorItem = (aggregator: IAggregatorItem) => {
  const result = new Map([
    ['avito_house', { ...aggregator, component: HouseAvito }],
    ['cian_house', { ...aggregator, component: HouseCian }],
    ['dom_click_house', { ...aggregator, component: HouseDomClick }],
    ['yandex_house', { ...aggregator, component: HouseYandex }],
    ['m2_house', { ...aggregator, component: HouseM2 }]
  ])
  return result.get(aggregator.type)!
}
</script>

<template>
  <AggregatorsLayout
    v-if="is_data_loaded"
    :aggregators="aggregators_items"
    :getIsStateBeforeEqualAfter="getIsStateBeforeEqualAfter"
    @pushCommonData="pushCommonData"
  >
    <FormLayout :apply="apply">
      <PskGridContainer grid-column-count="3">
        <DefaultFormFields v-model="default_fields" is_show_dates />

        <PskInput v-model="name" label="Название" disabled required class="span-2" />
        <PskInput v-model="ready_date" label="Срок сдачи" placeholder="Введите название" required />
        <PskInput v-model="title_for_site" label="Название для сайта" placeholder="Введите название" class="span-2" />
        <PskInput v-model="slug" label="Якорная ссылка" placeholder="Введите название" />
        <PskSelect v-model="offer_type" label="Тип предложения" :options="refs.house_offer_types" />

        <PskGridContainer grid-column-count="3" grid-span="3" title="Об объекте">
          <PskInput v-model="address_fillable" label="Адрес" placeholder="Введите адрес" class="span-3" />
          <PskSelect
            v-model="legal_entity_uid"
            :options="refs.company_groups_with_legal_entities"
            group
            label="Застройщик"
            options_value="value"
            options_label="label"
            placeholder="Выберите застройщика"
          />
          <PskInput v-model="floors" label="Этажность" disabled required />
          <div></div>
          <PskInput v-model="construction_method" label="Материал стен" />
          <PskDate label="Дата старта продаж" v-model="sales_start" />
          <div></div>
          <PskDate label="Дата ввода в эксплуатацию, до" v-model="commissioning_before" />
          <PskDate label="Дата Передачи ключей, до" v-model="keys_delivery_before" />
          <div></div>
          <PskDate label="Дата фактического ввода в эксплуатацию" v-model="actual_commissioning_at" />
          <PskDate label="Дата фактической передачи ключей" v-model="actual_keys_delivery_at" />
          <UploadMedia v-model="materials" :types="material_type_options" />
        </PskGridContainer>
      </PskGridContainer>
    </FormLayout>
  </AggregatorsLayout>
</template>
