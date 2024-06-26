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
  type IEstateAggregatorDomClick,
  fetchGetEstateAggregatorDomClick,
  fetchUpdateEstateAggregatorDomClick
} from '@/services/REST/dom_admin/estate'

const router = useRouter()
const refs = useRefs(
  'dom-click-balcony-types',
  'dom-click-bathroom-types',
  'real-property-types',
  'real-property-square-types'
)
const { material_type_options, materials, getMaterials, attach, detach } = useUploadMaterials('dom_click_real_property')
const { unloading_parameters, setParameters, getRequestParameters } = useUnloadingParameters()
const { is_data_loaded, apply, getIsStateBeforeEqualAfter } = useEditorView({
  router,
  back_route_name: 'parking_list',
  fetchGetEntity: fetchGetEstateAggregatorDomClick,
  fetchGetEntityUid: (route_params) => route_params.aggregator_uid as string,
  apply: {
    update: {
      fetchUpdateEntity: fetchUpdateEstateAggregatorDomClick,
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

    bathroom.value = form_data.data.bathroom || ''
    balcony.value = form_data.data.balcony || ''
    description.value = form_data.data.description || ''
  },
  getRequestData: (): IEstateAggregatorDomClick['data'] => ({
    ...getRequestParameters(),

    description: description.value,
    bathroom: bathroom.value,
    balcony: balcony.value
  })
})

const description = ref<IEstateAggregatorDomClick['data']['description']>('')
const bathroom = ref<IEstateAggregatorDomClick['data']['bathroom']>('bathroom')
const balcony = ref<IEstateAggregatorDomClick['data']['balcony']>('balcony')

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
        <PskSelect v-model="bathroom" label="Санузел" :options="refs.dom_click_bathroom_types" />
        <PskSelect v-model="balcony" label="Наличие балкона" :options="refs.dom_click_balcony_types" />
      </div>
      <UploadMedia style="grid-column: span 3" v-model="materials" :types="material_type_options" />
      <PskWYSIWYGEditor label="Описание" v-model="description" />
    </div>
  </FormLayout>
</template>
