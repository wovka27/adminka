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
    <div class="PlanRelativesEditorView">
      <div class="PlanRelativesEditorView__boxFields1 gridForm">
        <PskInput style="grid-column: span 2" v-model="name" label="Название" required placeholder="Введите название" />
        <PskSelect
          style="grid-column: span 2"
          v-model="feature_uid"
          options_value="value"
          options_label="label"
          required
          label="Особенности"
          :options="refs.features"
        />
        <PskCascader
          style="grid-column: span 2"
          label="Родительская планировка"
          required
          v-model="plan_uid"
          :options="refs.complexes_with_plans"
        />
        <PskCascader
          style="grid-column: span 2"
          label="Связанные планировки"
          required
          multiple
          v-model="relatives"
          :options="refs.complexes_with_plans"
        />
        <PskWYSIWYGEditor style="grid-column: span 3" v-model="description" label="Описание" />
      </div>
    </div>
  </FormLayout>
</template>

<style lang="scss">
.PlanRelativesEditorView {
  height: 100%;
}

.PlanRelativesEditorView__boxFields1 {
  margin: 20px 0 0 0;
}

.FlatEditorView__boxFields2H1 {
  @include setFontStyle6();

  margin: 50px 0 10px 0;
  grid-column: span 3;
}

.PlanRelativesEditorView__FormSite {
  margin: 20px 0 0 0;
}

.PlanRelativesEditorView__h1 {
  @include setFontStyle6();
  margin: 50px 0 30px 0;
}
</style>
