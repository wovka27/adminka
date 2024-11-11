<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import FormLayout from '@/layouts/FormLayout.vue'

import useEditorView from '@/composables/app/useEditorView'
import useRefs from '@/composables/app/useRefs'
import useUploadMaterials from '@/composables/app/useUploadMaterials'

import {
  type IHouseAggregatorAvito,
  fetchGetHouseAggregatorAvito,
  fetchUpdateHouseAggregatorAvito
} from '@/services/REST/dom_admin/house'

const router = useRouter()
const refs = useRefs('avito-elevator', 'avito-courtyard', 'avito-parking')
const { material_type_options, materials, getMaterials, attach, detach } = useUploadMaterials('avito_house')

const { is_data_loaded, apply, getIsStateBeforeEqualAfter } = useEditorView({
  router,
  back_route_name: 'house_list',
  fetchGetEntity: fetchGetHouseAggregatorAvito,
  fetchGetEntityUid: (route_params) => route_params.aggregator_uid as string,
  apply: {
    update: {
      fetchUpdateEntity: fetchUpdateHouseAggregatorAvito,
      beforeResponseFn: async () => {
        await detach(router.currentRoute.value.params.aggregator_uid as string)
        await attach(router.currentRoute.value.params.aggregator_uid as string)
      }
    }
  },
  setFormData: (form_data) => {
    getMaterials(form_data.media)
    house_id.value = form_data.data.house_id || ''
    courtyard.value = form_data.data.courtyard || []
    parking.value = form_data.data.parking || []
    freight_elevator.value = form_data.data.freight_elevator || ''
    passenger_elevator.value = form_data.data.passenger_elevator || ''
  },
  getRequestData: () => ({
    house_id: house_id.value,
    courtyard: courtyard.value,
    parking: parking.value,
    freight_elevator: freight_elevator.value,
    passenger_elevator: passenger_elevator.value
  })
})

const house_id = ref<IHouseAggregatorAvito['data']['house_id']>('')
const courtyard = ref<IHouseAggregatorAvito['data']['courtyard']>([])
const parking = ref<IHouseAggregatorAvito['data']['parking']>([])
const freight_elevator = ref<IHouseAggregatorAvito['data']['freight_elevator']>('')
const passenger_elevator = ref<IHouseAggregatorAvito['data']['passenger_elevator']>('')

defineExpose({ getIsStateBeforeEqualAfter })
</script>

<template>
  <FormLayout v-if="is_data_loaded" :apply="apply">
    <PskGridContainer grid-column-count="3" grid-span="3">
      <PskAlert class="span-3" type="info" text="Данная информация будет использоваться для вывода на Авито" />
      <PskInput v-model="house_id" label="ID ГП объекта" placeholder="Введите ID" type="number" />
      <PskSelect v-model="courtyard" label="Двор" :options="refs.avito_courtyard" multiple />
      <PskSelect v-model="parking" label="Парковка" :options="refs.avito_parking" multiple />
      <PskSelect v-model="passenger_elevator" label="Пассажирский лифт" :options="refs.avito_elevator" />
      <PskSelect v-model="freight_elevator" label="Грузовой лифт" :options="refs.avito_elevator" />
      <PskGridContainer v-if="material_type_options?.length" grid-span="3" grid-column-count="3" title="Галерея">
        <UploadMedia class="span-3" v-model="materials" :types="material_type_options" />
      </PskGridContainer>
    </PskGridContainer>
  </FormLayout>
</template>
