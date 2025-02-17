<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import FormLayout from '@/layouts/FormLayout.vue'

import FeedAggregatorAlertTitle from '@/components/FeedAggregatorAlertTitle.vue'

import useEditorView from '@/composables/app/useEditorView'

import { fetchGetComplexAggregatorAvito, fetchUpdateComplexAggregatorAvito } from '@/services/REST/dom_admin/complex'

const router = useRouter()

const { is_data_loaded, apply, getIsStateBeforeEqualAfter } = useEditorView({
  router,
  fetchGetEntity: fetchGetComplexAggregatorAvito,
  fetchGetEntityUid: (route_params) => route_params.aggregator_uid as string,
  back_route_name: 'complex_list',
  apply: { update: { fetchUpdateEntity: fetchUpdateComplexAggregatorAvito } },
  setFormData: (form_data) => {
    complex_id.value = form_data.data.complex_id || ''
  },
  getRequestData: () => ({ complex_id: complex_id.value })
})

const complex_id = ref('')

defineExpose({ getIsStateBeforeEqualAfter })
</script>

<template>
  <FormLayout v-if="is_data_loaded" :apply="apply">
    <PskGridContainer grid-span="3" grid-column-count="3">
      <FeedAggregatorAlertTitle type="avito" />
      <PskInput v-model="complex_id" label="ID ЖК из базы" placeholder="Введите ID ЖК" />
    </PskGridContainer>
  </FormLayout>
</template>
