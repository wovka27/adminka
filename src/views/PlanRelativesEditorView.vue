<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import FormLayout from '@/layouts/FormLayout.vue'

import useEditorView from '@/composables/app/useEditorView'
import useRefs from '@/composables/app/useRefs'

import {
  fetchCreatePlanRelative,
  fetchGetPlanRelative,
  fetchUpdatePlanRelative
} from '@/services/REST/dom_admin/plans_relatives'

import getHandleBackArgs from '@/helpers/getHandleBackArgs'

const router = useRouter()
const refs = useRefs('features', 'complexes-with-plans')
const { is_data_loaded, apply } = useEditorView({
  router,
  fetchGetEntity: fetchGetPlanRelative,
  back_route_name: 'plan_relatives_list',
  apply: {
    create: {
      fetchCreateEntity: fetchCreatePlanRelative,
      success_message: 'Связь успешно создана'
    },
    update: {
      fetchUpdateEntity: fetchUpdatePlanRelative
    }
  },
  getRequestData: () => ({
    name: name.value,
    description: description.value,
    feature_uid: feature_uid.value,
    plan_uid: plan_uid.value,
    relatives: relatives.value
  }),
  setFormData: (form_data) => {
    name.value = form_data.name
    description.value = form_data.description || ''
    feature_uid.value = form_data.feature_uid || ''
    plan_uid.value = form_data.plan_uid || ''
    relatives.value = form_data.relatives || []
  },
  mount: {
    common: {
      app_header_props: ([response_plan_relatives]) => ({
        title: response_plan_relatives.name,
        breadcrumbs: [
          {
            label: 'Планировки'
          },
          {
            label: 'Связи',
            route: getHandleBackArgs('plan_relatives_list')
          },
          { label: response_plan_relatives.name }
        ]
      })
    },
    create: {
      app_header_props: {
        title: `Добавить связь`,
        breadcrumbs: [
          {
            label: 'Планировки'
          },
          {
            label: 'Связи',
            route: getHandleBackArgs('plan_relatives_list')
          },
          { label: `Добавить связь` }
        ]
      }
    }
  }
})

const name = ref('')
const description = ref('')
const feature_uid = ref('')
const plan_uid = ref()
const relatives = ref([])
</script>

<template>
  <FormLayout v-if="is_data_loaded" :apply="apply">
    <PskGridContainer grid-column-count="3">
      <PskInput v-model="name" label="Название" required placeholder="Введите название" class="span-2" />
      <div></div>
      <PskSelect
        v-model="feature_uid"
        options_value="value"
        options_label="label"
        required
        label="Особенности"
        :options="refs.features"
        class="span-2"
      />
      <div></div>
      <PskCascader
        label="Родительская планировка"
        required
        v-model="plan_uid"
        :options="refs.complexes_with_plans"
        class="span-2"
      />
      <div></div>
      <PskCascader
        label="Связанные планировки"
        required
        multiple
        v-model="relatives"
        :options="refs.complexes_with_plans"
        class="span-2"
      />
      <PskWYSIWYGEditor v-model="description" label="Описание" />
    </PskGridContainer>
  </FormLayout>
</template>
