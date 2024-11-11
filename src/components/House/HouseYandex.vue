<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import FormLayout from '@/layouts/FormLayout.vue'

import useEditorView from '@/composables/app/useEditorView'
import useRefs from '@/composables/app/useRefs'
import useUploadMaterials from '@/composables/app/useUploadMaterials'

import {
  type IHouseAggregatorYandex,
  fetchGetHouseAggregatorYandex,
  fetchUpdateHouseAggregatorYandex
} from '@/services/REST/dom_admin/house'

const router = useRouter()
const refs = useRefs('yandex-building-state')
const { material_type_options, materials, getMaterials, attach, detach } = useUploadMaterials('yandex_house')

const { is_data_loaded, apply, getIsStateBeforeEqualAfter } = useEditorView({
  router,
  back_route_name: 'house_list',
  fetchGetEntity: fetchGetHouseAggregatorYandex,
  fetchGetEntityUid: (route_params) => route_params.aggregator_uid as string,
  apply: {
    update: {
      fetchUpdateEntity: fetchUpdateHouseAggregatorYandex,
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
    building_phase.value = form_data.data.building_phase || ''
    guarded_building.value = !!form_data.data.guarded_building
    parking.value = !!form_data.data.parking
    lift.value = !!form_data.data.lift
    rubbish_chute.value = !!form_data.data.rubbish_chute
    building_state.value = form_data.data.building_state || ''
    is_elite.value = !!form_data.data.is_elite
  },
  getRequestData: () => ({
    house_id: house_id.value,
    building_phase: building_phase.value,
    guarded_building: guarded_building.value,
    parking: parking.value,
    lift: lift.value,
    rubbish_chute: rubbish_chute.value,
    building_state: building_state.value,
    is_elite: is_elite.value
  })
})

const house_id = ref<IHouseAggregatorYandex['data']['house_id']>('')
const building_phase = ref<IHouseAggregatorYandex['data']['building_phase']>('')
const guarded_building = ref<IHouseAggregatorYandex['data']['guarded_building']>(false)
const parking = ref<IHouseAggregatorYandex['data']['parking']>(false)
const lift = ref<IHouseAggregatorYandex['data']['lift']>(false)
const rubbish_chute = ref<IHouseAggregatorYandex['data']['rubbish_chute']>(false)
const building_state = ref<IHouseAggregatorYandex['data']['building_state']>('')
const is_elite = ref<IHouseAggregatorYandex['data']['is_elite']>(false)

defineExpose({ getIsStateBeforeEqualAfter })
</script>

<template>
  <FormLayout v-if="is_data_loaded" :apply="apply">
    <PskGridContainer grid-column-count="3" grid-span="3">
      <PskAlert
        class="span-3"
        type="info"
        text="Данная информация будет использоваться для вывода на Яндекс.Недвижимость"
      />
      <PskInput v-model="house_id" label="Номер ГП из базы ЯН" placeholder="Введите ID" type="number" />
      <PskInput v-model="building_phase" label="Очередь строительства" type="number" />
      <PskSelect v-model="building_state" label="Стадия строительства дома" :options="refs.yandex_building_state" />
      <div style="grid-column: span 3; display: flex; flex-wrap: wrap; gap: 20px 30px">
        <PskSwitch v-model="is_elite" label="Элитная недвижимость" />
        <PskSwitch v-model="guarded_building" label="Закрытая территория" />
        <PskSwitch v-model="parking" label="Наличие охраняемой парковки" />
        <PskSwitch v-model="lift" label="Наличие лифта" />
        <PskSwitch v-model="rubbish_chute" label="Наличие мусоропровода" />
      </div>
      <PskGridContainer grid-span="3" grid-column-count="3" title="Галерея">
        <UploadMedia class="span-3" v-model="materials" :types="material_type_options" />
      </PskGridContainer>
    </PskGridContainer>
  </FormLayout>
</template>
