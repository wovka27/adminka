<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import FormLayout from '@/layouts/FormLayout.vue'

import useEditorView from '@/composables/app/useEditorView'

import { fetchGetComplexAggregatorYandex, fetchUpdateComplexAggregatorYandex } from '@/services/REST/dom_admin/complex'

const router = useRouter()

const { apply, is_data_loaded, getIsStateBeforeEqualAfter } = useEditorView({
  router,
  fetchGetEntity: fetchGetComplexAggregatorYandex,
  back_route_name: 'complex_list',
  fetchGetEntityUid: (route_params) => route_params.aggregator_uid as string,
  apply: { update: { fetchUpdateEntity: fetchUpdateComplexAggregatorYandex } },
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
    <div class="gridForm">
      <PskAlert
        style="grid-column: span 3"
        type="info"
        text="Данная информация будет использоваться для вывода на Яндекс.Недвижимость"
      />
      <PskInput v-model="complex_id" label="ID ЖК из базы" placeholder="Введите ID ЖК" />
    </div>
  </FormLayout>
</template>
