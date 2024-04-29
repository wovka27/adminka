<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import FormLayout from '@/layouts/FormLayout.vue'

import DefaultFormFields from '@/components/DefaultFormFields.vue'

import useEditorView from '@/composables/app/useEditorView'
import useRefs from '@/composables/app/useRefs'

import {
  fetchCreateCompilation,
  fetchGetCompilationItem,
  fetchUpdateCompilation
} from '@/services/REST/dom_admin/compilation'

import checkForCompletionRequiredFields from '@/helpers/checkForCompletionRequiredFields'
import getHandleBackArgs from '@/helpers/getHandleBackArgs'

const router = useRouter()
const refs = useRefs('complexes', 'features')
const { is_data_loaded, apply, default_fields } = useEditorView({
  router,
  fetchGetEntity: fetchGetCompilationItem,
  back_route_name: 'compilation_list',
  default_fields: true,
  apply: {
    create: {
      beforeResponseFn: async () => {
        return checkForCompletionRequiredFields(
          !name.value ||
            !complexes.value.length ||
            !conditions.value.length ||
            !slug.value ||
            !default_fields.value.weight
        )
      },
      fetchCreateEntity: fetchCreateCompilation,
      success_message: 'Подборка успешно создана'
    },
    update: {
      fetchUpdateEntity: fetchUpdateCompilation
    }
  },
  setFormData: (form_data) => {
    name.value = form_data.name || ''
    slug.value = form_data.slug || ''
    complexes.value = form_data.complexes || []
    conditions.value = form_data.conditions || []
  },
  getRequestData: () => ({
    name: name.value,
    slug: slug.value,
    complexes: complexes.value,
    conditions: conditions.value
  }),
  mount: {
    create: {
      app_header_props: {
        title: `Добавить подборку`,
        breadcrumbs: [
          {
            label: 'Подборки',
            route: {
              name: 'compilation_list'
            }
          },
          { label: 'Добавить объект' }
        ]
      }
    },
    common: {
      app_header_props: ([response_compilation]) => ({
        title: response_compilation.name,
        breadcrumbs: [
          {
            label: 'Подборки',
            route: getHandleBackArgs('compilation_list')
          },
          { label: response_compilation.name }
        ]
      })
    }
  }
})

const name = ref('')
const complexes = ref<string[]>([])
const conditions = ref<string[]>([])
const slug = ref<string>('')
</script>

<template>
  <FormLayout v-if="is_data_loaded" :apply="apply">
    <div class="CompilationEditorView">
      <DefaultFormFields v-model="default_fields" is_show_dates />

      <div class="CompilationEditorView__boxFields1 gridForm">
        <PskInput style="grid-column: span 2" v-model="name" label="Название" required placeholder="Введите название" />
        <PskSelect
          style="grid-column: span 2"
          v-model="complexes"
          label="Жилой комплекс"
          options_label="label"
          options_value="value"
          required
          multiple
          :options="refs.complexes"
        />
        <div style="grid-column: span 2" class="gridForm">
          <PskSelect
            style="grid-column: span 2"
            v-model="conditions"
            label="Условия"
            options_label="label"
            options_value="value"
            required
            multiple
            :options="refs.features"
          />
          <PskInput v-model="slug" label="Якорная ссылка" required placeholder="Введите название" />
        </div>
      </div>
    </div>
  </FormLayout>
</template>

<style lang="scss">
.CompilationEditorView {
  height: 100%;
}

.CompilationEditorView__boxFields1 {
  margin: 20px 0 0 0;
}

.CompilationEditorView__FormSite {
  margin: 20px 0 0 0;
}

.CompilationEditorView__h1 {
  @include setFontStyle6();
  margin: 50px 0 30px 0;
}
</style>
