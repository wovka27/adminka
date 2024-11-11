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
  back_route_name: 'pantry_list',
  fetchGetEntity: fetchGetEstateAggregatorDomClick,
  fetchGetEntityUid: (route_params) => route_params.aggregator_uid as string,
  apply: {
    update: {
      fetchUpdateEntity: fetchUpdateEstateAggregatorDomClick,
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

    bathroom.value = form_data.data.bathroom || ''
    balcony.value = form_data.data.balcony || ''
    description.value = form_data.data.description || ''
  },
  getRequestData: () => ({
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
    <PskGridContainer grid-column-count="3" grid-span="3">
      <PskAlert
        class="span-3"
        style="margin-top: 10px"
        type="info"
        text="Данная информация будет использоваться для вывода на Авито"
      />
      <UnloadingParameters v-model="unloading_parameters" />
      <PskGridContainer grid-column-count="3" grid-span="3" title="Общая информация">
        <PskSelect v-model="bathroom" label="Санузел" :options="refs.dom_click_bathroom_types" />
        <PskSelect v-model="balcony" label="Наличие балкона" :options="refs.dom_click_balcony_types" />
      </PskGridContainer>
      <PskWYSIWYGEditor label="Описание" v-model="description" />
      <UploadMedia class="span-3" v-model="materials" :types="material_type_options" />
    </PskGridContainer>
  </FormLayout>
</template>
