<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import FormLayout from '@/layouts/FormLayout.vue'

import FeedAggregatorAlertTitle from '@/components/FeedAggregatorAlertTitle.vue'

import useEditorView from '@/composables/app/useEditorView'
import useRefs from '@/composables/app/useRefs'
import useUploadMaterials from '@/composables/app/useUploadMaterials'

import {
  type IHouseAggregatorDomClick,
  fetchGetHouseAggregatorDomClick,
  fetchUpdateHouseAggregatorDomClick
} from '@/services/REST/dom_admin/house'

import convertDateToRequest from '@/helpers/convertDateToRequest'

const router = useRouter()
const refs = useRefs('dom-click-building-state')
const { material_type_options, materials, getMaterials, attach, detach } = useUploadMaterials('dom_click_house')

const { is_data_loaded, apply, getIsStateBeforeEqualAfter } = useEditorView({
  router,
  back_route_name: 'house_list',
  fetchGetEntity: fetchGetHouseAggregatorDomClick,
  fetchGetEntityUid: (route_params) => route_params.aggregator_uid as string,
  apply: {
    update: {
      fetchUpdateEntity: fetchUpdateHouseAggregatorDomClick,
      beforeResponseFn: async () => {
        const uid = router.currentRoute.value.params.aggregator_uid as string

        await detach(uid)
        await attach(uid)
      }
    }
  },
  setFormData: (form_data) => {
    getMaterials(form_data.media)
    house_id.value = form_data.data.house_id || ''
    date_complete.value =
      typeof form_data.data.date_complete === 'string' ? new Date(form_data.data.date_complete) : null
    floors_ready.value = form_data.data.floors_ready || ''
    building_state.value = form_data.data.building_state || ''
    building_phase.value = form_data.data.building_phase || ''
    ceiling_height.value = form_data.data.ceiling_height || ''
    passenger_lifts_count.value = form_data.data.passenger_lifts_count || ''
    cargo_lifts_count.value = form_data.data.cargo_lifts_count || ''
  },
  getRequestData: () => ({
    house_id: house_id.value,
    date_complete: date_complete.value && convertDateToRequest(date_complete.value),
    floors_ready: floors_ready.value,
    building_state: building_state.value,
    building_phase: building_phase.value,
    ceiling_height: ceiling_height.value,
    passenger_lifts_count: passenger_lifts_count.value,
    cargo_lifts_count: cargo_lifts_count.value
  })
})

const house_id = ref<IHouseAggregatorDomClick['data']['house_id']>('')
const date_complete = ref()
const floors_ready = ref<IHouseAggregatorDomClick['data']['floors_ready']>('')
const building_state = ref<IHouseAggregatorDomClick['data']['building_state']>('')
const building_phase = ref<IHouseAggregatorDomClick['data']['building_phase']>('')
const ceiling_height = ref<IHouseAggregatorDomClick['data']['ceiling_height']>('')
const passenger_lifts_count = ref<IHouseAggregatorDomClick['data']['passenger_lifts_count']>('')
const cargo_lifts_count = ref<IHouseAggregatorDomClick['data']['cargo_lifts_count']>('')

defineExpose({ getIsStateBeforeEqualAfter })
</script>

<template>
  <FormLayout v-if="is_data_loaded" :apply="apply">
    <PskGridContainer grid-column-count="3" grid-span="3">
      <FeedAggregatorAlertTitle type="dom_click" />
      <PskInput v-model="house_id" label="ID ГП объекта" placeholder="Введите ID" type="number" />
      <PskDate v-model="date_complete" label="Фактическая дата сдачи" />
      <div></div>
      <PskInput
        v-model="floors_ready"
        label="Количество построенных этажей"
        placeholder="Введите количество"
        type="number"
      />
      <PskSelect v-model="building_state" label="Статус стройки" :options="refs.dom_click_building_state" />
      <PskInput v-model="building_phase" label="Очередь строительства" type="number" />
      <PskInput v-model="ceiling_height" label="Высота потолков в квартирах" />
      <PskGridContainer v-if="material_type_options?.length" grid-span="3" grid-column-count="3" title="Галерея">
        <UploadMedia class="span-3" v-model="materials" :types="material_type_options" />
      </PskGridContainer>
    </PskGridContainer>
  </FormLayout>
</template>
