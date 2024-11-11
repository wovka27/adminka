<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import FormLayout from '@/layouts/FormLayout.vue'

import useEditorView from '@/composables/app/useEditorView'
import useRefs from '@/composables/app/useRefs'
import useUploadMaterials from '@/composables/app/useUploadMaterials'

import {
  type IHouseAggregatorM2,
  fetchGetHouseAggregatorM2,
  fetchUpdateHouseAggregatorM2
} from '@/services/REST/dom_admin/house'

const router = useRouter()
const refs = useRefs('cian-parking')
const { material_type_options, materials, getMaterials, attach, detach } = useUploadMaterials('m2_house')

const { is_data_loaded, apply, getIsStateBeforeEqualAfter } = useEditorView({
  router,
  back_route_name: 'house_list',
  fetchGetEntity: fetchGetHouseAggregatorM2,
  fetchGetEntityUid: (route_params) => route_params.aggregator_uid as string,
  apply: {
    update: {
      fetchUpdateEntity: fetchUpdateHouseAggregatorM2,
      afterResponseFn: async () => {
        const uid = router.currentRoute.value.params.aggregator_uid as string

        await detach(uid)
        await attach(uid)
      }
    }
  },
  setFormData: (form_data) => {
    getMaterials(form_data.media)
    house_id.value = form_data.data.house_id || ''
    project_declaration_url.value = form_data.data.project_declaration_url || ''
    has_ramp.value = !!form_data.data.has_ramp
    parking_type.value = form_data.data.parking_type || ''
    is_house_complete.value = !!form_data.data.is_house_complete
    passenger_lifts_count.value = form_data.data.passenger_lifts_count || ''
    cargo_lifts_count.value = form_data.data.cargo_lifts_count || ''
  },
  getRequestData: () => ({
    house_id: house_id.value,
    project_declaration_url: project_declaration_url.value,
    has_ramp: has_ramp.value,
    parking_type: parking_type.value,
    is_house_complete: is_house_complete.value,
    passenger_lifts_count: passenger_lifts_count.value,
    cargo_lifts_count: cargo_lifts_count.value
  })
})

const house_id = ref<IHouseAggregatorM2['data']['house_id']>('')
const project_declaration_url = ref<IHouseAggregatorM2['data']['project_declaration_url']>('')
const has_ramp = ref<IHouseAggregatorM2['data']['has_ramp']>(false)
const parking_type = ref<IHouseAggregatorM2['data']['parking_type']>('')
const is_house_complete = ref<IHouseAggregatorM2['data']['is_house_complete']>(false)
const passenger_lifts_count = ref<IHouseAggregatorM2['data']['passenger_lifts_count']>('')
const cargo_lifts_count = ref<IHouseAggregatorM2['data']['cargo_lifts_count']>('')

defineExpose({ getIsStateBeforeEqualAfter })
</script>

<template>
  <FormLayout v-if="is_data_loaded" :apply="apply">
    <PskGridContainer grid-column-count="3" grid-span="3">
      <PskAlert class="span-3" type="info" text="Данная информация будет использоваться для вывода на М2" />
      <PskInput v-model="house_id" label="ID ГП объекта" placeholder="Введите ID" type="number" />
      <PskInput
        class="span-3"
        v-model="project_declaration_url"
        label="Проектная декларация"
        placeholder="Вставьте ссылку"
      />
      <PskSelect v-model="parking_type" label="Парковка" :options="refs.cian_parking" />
      <PskSwitch v-model="has_ramp" label="Пандус" />
      <PskSwitch v-model="is_house_complete" label="Дом сдан" />
      <PskGridContainer v-if="material_type_options?.length" grid-span="3" grid-column-count="3" title="Галерея">
        <UploadMedia class="span-3" v-model="materials" :types="material_type_options" />
      </PskGridContainer>
    </PskGridContainer>
  </FormLayout>
</template>
