<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import FormLayout from '@/layouts/FormLayout.vue'

import FeedAggregatorAlertTitle from '@/components/FeedAggregatorAlertTitle.vue'
import UnloadingParameters from '@/components/UnloadingParameters.vue'

import useEditorView from '@/composables/app/useEditorView'
import useRefs from '@/composables/app/useRefs'
import useUnloadingParameters from '@/composables/app/useUnloadingParameters'
import useUploadMaterials from '@/composables/app/useUploadMaterials'

import {
  type IEstateAggregatorCian,
  fetchGetEstateAggregatorCian,
  fetchUpdateEstateAggregatorCian
} from '@/services/REST/dom_admin/estate'

const router = useRouter()
const refs = useRefs('cian-categories', 'cian-decoration-types', 'real-property-types', 'real-property-square-types')
const { material_type_options, materials, getMaterials, attach, detach } = useUploadMaterials('idalite_real_property')
const { unloading_parameters, setParameters, getRequestParameters } = useUnloadingParameters()
const { is_data_loaded, apply, getIsStateBeforeEqualAfter } = useEditorView({
  router,
  back_route_name: 'pantry_list',
  fetchGetEntity: fetchGetEstateAggregatorCian,
  fetchGetEntityUid: (route_params) => route_params.aggregator_uid as string,
  apply: {
    update: {
      fetchUpdateEntity: fetchUpdateEstateAggregatorCian,
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

    description.value = form_data.data.description || ''
    decoration.value = form_data.data.decoration || ''
    category.value = form_data.data.category || ''
    phone_number.value = form_data.data.phone_number || ''
    is_in_hidden_base.value = Boolean(form_data.data.is_in_hidden_base)
    sale_type.value = form_data.data.sale_type || ''
    action_id.value = form_data.data.action_id || ''
  },
  getRequestData: () => ({
    ...getRequestParameters(),

    description: description.value,
    decoration: decoration.value,
    category: category.value,
    phone_number: phone_number.value,
    is_in_hidden_base: is_in_hidden_base.value,
    sale_type: sale_type.value,
    action_id: action_id.value
  })
})

const description = ref<IEstateAggregatorCian['data']['description']>('')
const category = ref<IEstateAggregatorCian['data']['category']>('')
const phone_number = ref<IEstateAggregatorCian['data']['phone_number']>('')
const is_in_hidden_base = ref<IEstateAggregatorCian['data']['is_in_hidden_base']>(false)
const sale_type = ref<IEstateAggregatorCian['data']['description']>('')
const action_id = ref<IEstateAggregatorCian['data']['sale_type']>('')
const decoration = ref<IEstateAggregatorCian['data']['decoration']>('')

defineExpose({ getIsStateBeforeEqualAfter })
</script>

<template>
  <FormLayout v-if="is_data_loaded" :apply="apply">
    <PskGridContainer grid-column-count="3" grid-span="3">
      <FeedAggregatorAlertTitle type="idalite" />
      <UnloadingParameters aggregator_type="idalite" v-model="unloading_parameters" />
      <PskGridContainer grid-span="3" grid-column-count="3" title="Общая информация">
        <PskSwitch v-model="is_in_hidden_base" label="Размещение в закрытой базе" class="span-3" />
        <PskSelect v-model="category" label="Категория" :options="refs.cian_categories" />
        <PskSelect v-model="decoration" label="Отделка" :options="refs.cian_decoration_types" />
        <PskInput v-model="phone_number" label="Телефон в объявлении" type="phone" />
      </PskGridContainer>
      <PskWYSIWYGEditor label="Описание" v-model="description" />
      <UploadMedia class="span-3" v-model="materials" :types="material_type_options" />
    </PskGridContainer>
  </FormLayout>
</template>
