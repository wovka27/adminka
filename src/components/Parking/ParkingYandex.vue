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
  type IEstateAggregatorYandex,
  fetchGetEstateAggregatorYandex,
  fetchUpdateEstateAggregatorYandex
} from '@/services/REST/dom_admin/estate'

const router = useRouter()
const refs = useRefs(
  'real-property-types',
  'yandex-balcony-types',
  'yandex-categories',
  'yandex-bathroom-types',
  'real-property-square-types'
)
const { material_type_options, materials, getMaterials, attach, detach } = useUploadMaterials('yandex_real_property')
const { unloading_parameters, setParameters, getRequestParameters } = useUnloadingParameters()
const { is_data_loaded, apply, getIsStateBeforeEqualAfter } = useEditorView({
  router,
  back_route_name: 'parking_list',
  fetchGetEntity: fetchGetEstateAggregatorYandex,
  fetchGetEntityUid: (route_params) => route_params.aggregator_uid as string,
  apply: {
    update: {
      fetchUpdateEntity: fetchUpdateEstateAggregatorYandex,
      beforeResponseFn: async () => {
        const uid = router.currentRoute.value.params.aggregator_uid as string

        await detach(uid)
        await attach(uid)
      }
    }
  },
  setFormData: (form_data) => {
    getMaterials(form_data.media)
    setParameters(form_data.data)

    balcony.value = form_data.data.balcony || ''
    description.value = form_data.data.description || ''
    rooms_type.value = form_data.data.rooms_type || ''
    bathroom_unit.value = form_data.data.bathroom_unit || ''
    studio.value = form_data.data.studio || ''
    category.value = form_data.data.category || ''
    is_image_order_change_allowed.value = !!form_data.data.is_image_order_change_allowed
    online_show.value = form_data.data.online_show || ''
    phone_number.value = form_data.data.phone_number || ''
  },
  getRequestData: (): IEstateAggregatorYandex['data'] => ({
    ...getRequestParameters(),

    description: description.value,
    balcony: balcony.value,
    rooms_type: rooms_type.value,
    bathroom_unit: bathroom_unit.value,
    studio: studio.value,
    category: category.value,
    is_image_order_change_allowed: is_image_order_change_allowed.value,
    online_show: online_show.value,
    phone_number: phone_number.value
  })
})

const description = ref<IEstateAggregatorYandex['data']['description']>('')
const balcony = ref<IEstateAggregatorYandex['data']['balcony']>('balcony')
const rooms_type = ref<IEstateAggregatorYandex['data']['rooms_type']>('')
const bathroom_unit = ref<IEstateAggregatorYandex['data']['bathroom_unit']>('')
const studio = ref<IEstateAggregatorYandex['data']['studio']>('')
const category = ref<IEstateAggregatorYandex['data']['category']>('')
const is_image_order_change_allowed = ref<IEstateAggregatorYandex['data']['is_image_order_change_allowed']>(false)
const online_show = ref<IEstateAggregatorYandex['data']['online_show']>('')
const phone_number = ref<IEstateAggregatorYandex['data']['phone_number']>('')

defineExpose({ getIsStateBeforeEqualAfter })
</script>

<template>
  <FormLayout v-if="is_data_loaded" :apply="apply">
    <div class="gridForm">
      <PskAlert
        style="grid-column: span 3; margin-top: 10px"
        type="info"
        text="Данная информация будет использоваться для вывода на Авито"
      />
      <UnloadingParameters v-model="unloading_parameters" />
      <div style="grid-column: span 3" class="ComplexEditorView__boxFields2 gridForm">
        <h3 class="ComplexEditorView__boxFields2H1">Общая информация</h3>
        <PskSelect v-model="bathroom_unit" label="Санузел" :options="refs.yandex_bathroom_types" />
        <PskSelect v-model="balcony" label="Наличие балкона" :options="refs.yandex_balcony_types" />
      </div>
      <UploadMedia style="grid-column: span 3" v-model="materials" :types="material_type_options" />
      <PskWYSIWYGEditor label="Описание" v-model="description" />
    </div>
  </FormLayout>
</template>
