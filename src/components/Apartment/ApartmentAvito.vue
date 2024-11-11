<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import FormLayout from '@/layouts/FormLayout.vue'

import UnloadingParameters from '@/components/UnloadingParameters.vue'

import useEditorView from '@/composables/app/useEditorView'
import useRefs from '@/composables/app/useRefs'
import useUnloadingParameters from '@/composables/app/useUnloadingParameters'
import useUploadMaterials from '@/composables/app/useUploadMaterials'

import {
  type IEstateAggregatorAvito,
  fetchGetEstateAggregatorAvito,
  fetchUpdateEstateAggregatorAvito
} from '@/services/REST/dom_admin/estate'

const router = useRouter()
const refs = useRefs(
  'real-property-types',
  'avito-categories',
  'avito-operation-types',
  'avito-deal-types',
  'avito-market-types',
  'avito-deal-types',
  'avito-listing-fee-types',
  'avito-nd-additionally',
  'avito-room-types',
  'avito-decoration-types',
  'avito-bathroom-types',
  'avito-balcony-types',
  'avito-contact-methods',
  'interior-types',
  'avito-property-rights',
  'real-property-square-types',
  'avito-replacement-room-count'
)
const { material_type_options, materials, getMaterials, attach, detach } = useUploadMaterials('avito_real_property')
const { setParameters, unloading_parameters, getRequestParameters } = useUnloadingParameters()
const { is_data_loaded, apply, getIsStateBeforeEqualAfter } = useEditorView({
  router,
  back_route_name: 'flat_list',
  fetchGetEntity: fetchGetEstateAggregatorAvito,
  fetchGetEntityUid: (route_params) => route_params.aggregator_uid as string,
  apply: {
    update: {
      fetchUpdateEntity: fetchUpdateEstateAggregatorAvito,
      afterResponseFn: async () => {
        const uid = router.currentRoute.value.params.aggregator_uid as string

        await detach(uid)
        await attach(uid)
      }
    }
  },
  setFormData: (form_data) => {
    getMaterials(form_data.media)
    setParameters(form_data.data)
    property_category.value = form_data.data.property_category || ''
    nd_additionally.value = form_data.data.nd_additionally || []
    operation_type.value = form_data.data.operation_type || []
    property_status.value = form_data.data.property_status || []
    market_type.value = form_data.data.market_type || ''
    property_rights.value = form_data.data.property_rights || ''
    listing_fee.value = form_data.data.listing_fee || ''
    deal_type.value = form_data.data.deal_type || ''
    decoration.value = form_data.data.decoration || ''
    phone_number.value = form_data.data.phone_number || ''
    contact_method.value = form_data.data.contact_method || ''
    description.value = form_data.data.description || ''
    balcony_or_loggia.value = form_data.data.balcony_or_loggia || []
    bathroom.value = form_data.data.bathroom || []
    room_type.value = form_data.data.room_type || []
  },
  getRequestData: () => ({
    ...getRequestParameters(),
    property_category: property_category.value,
    balcony_or_loggia: balcony_or_loggia.value,
    bathroom: bathroom.value,
    room_type: room_type.value,
    operation_type: operation_type.value,
    property_status: property_status.value,
    market_type: market_type.value,
    property_rights: property_rights.value,
    listing_fee: listing_fee.value,
    deal_type: deal_type.value,
    nd_additionally: nd_additionally.value,
    decoration: decoration.value,
    phone_number: phone_number.value,
    contact_method: contact_method.value,
    description: description.value
  })
})

const property_category = ref<IEstateAggregatorAvito['data']['property_category']>('')
const operation_type = ref<IEstateAggregatorAvito['data']['operation_type']>([])
const property_status = ref<IEstateAggregatorAvito['data']['property_status']>([])
const market_type = ref<IEstateAggregatorAvito['data']['market_type']>('')
const property_rights = ref<IEstateAggregatorAvito['data']['property_rights']>('')
const listing_fee = ref<IEstateAggregatorAvito['data']['listing_fee']>('')
const deal_type = ref<IEstateAggregatorAvito['data']['deal_type']>('')
const decoration = ref<IEstateAggregatorAvito['data']['decoration']>('')
const nd_additionally = ref<IEstateAggregatorAvito['data']['nd_additionally']>([])
const phone_number = ref<IEstateAggregatorAvito['data']['phone_number']>('')
const contact_method = ref<IEstateAggregatorAvito['data']['contact_method']>('')
const description = ref<IEstateAggregatorAvito['data']['description']>('')
const balcony_or_loggia = ref<IEstateAggregatorAvito['data']['balcony_or_loggia']>([])
const bathroom = ref<IEstateAggregatorAvito['data']['bathroom']>([])
const room_type = ref<IEstateAggregatorAvito['data']['room_type']>([])

defineExpose({ getIsStateBeforeEqualAfter })
</script>

<template>
  <FormLayout v-if="is_data_loaded" :apply="apply">
    <PskGridContainer grid-column-count="3" grid-span="3">
      <PskAlert
        class="span-3"
        style="margin-top: 10px"
        type="info"
        text="Данная информация будет использоваться для вывода на Авито"
      />
      <UnloadingParameters
        v-model="unloading_parameters"
        :replacement_room_count_options="refs.avito_replacement_room_count"
      />
      <PskGridContainer grid-span="3" grid-column-count="3" title="Общая информация">
        <PskSelect
          v-model="property_category"
          label="Категория объекта недвижимости"
          :options="refs.avito_categories"
        />
        <PskSelect v-model="operation_type" label="Тип объявления" :options="refs.avito_operation_types" />
        <PskSelect v-model="property_status" label="Статус недвижимости" :options="refs.avito_property_statuses" />
        <PskSelect v-model="market_type" label="Принадлежность квартиры к рынку" :options="refs.avito_market_types" />
        <PskSelect v-model="property_rights" label="Право собственности" :options="refs.avito_property_rights" />
        <PskSelect v-model="listing_fee" label="Вариант платного размещения" :options="refs.avito_listing_fee_types" />
        <PskSelect v-model="deal_type" label="Тип сделки" :options="refs.avito_deal_types" />
        <PskSelect v-model="nd_additionally" label="Дополнительно" :options="refs.avito_nd_additionally" multiple />
        <div></div>
        <PskSelect v-model="room_type" label="Тип комнаты" :options="refs.avito_room_types" required multiple />
        <PskSelect v-model="decoration" label="Отделка помещения" :options="refs.avito_decoration_types" />
        <div></div>
        <PskSelect v-model="bathroom" label="Санузел" :options="refs.avito_bathroom_types" multiple />
        <PskSelect v-model="balcony_or_loggia" label="Балкон или лоджия" :options="refs.avito_balcony_types" multiple />
        <div></div>
        <PskInput v-model="phone_number" label="Телефон в объявлении" placeholder="Введите номер" type="phone" />
        <PskSelect v-model="contact_method" label="Способ связи" :options="refs.avito_contact_methods" />
      </PskGridContainer>
      <PskWYSIWYGEditor label="Описание" v-model="description" />
      <UploadMedia class="span-3" v-model="materials" :types="material_type_options" />
    </PskGridContainer>
  </FormLayout>
</template>
