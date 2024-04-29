<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import FormLayout from '@/layouts/FormLayout.vue'

import DefaultFormFields from '@/components/DefaultFormFields.vue'

import useEditorView from '@/composables/app/useEditorView'
import useRefs from '@/composables/app/useRefs'
import useUploadMaterials from '@/composables/app/useUploadMaterials'

import {
  fetchCreateInfrastructureCategoryItem,
  fetchGetInfrastructureCategoryItem,
  fetchUpdateInfrastructureCategoryItem
} from '@/services/REST/dom_admin/infrastructure_category'

import checkForCompletionRequiredFields from '@/helpers/checkForCompletionRequiredFields'
import getHandleBackArgs from '@/helpers/getHandleBackArgs'

const router = useRouter()
const refs = useRefs('complexes')
const { material_type_options, materials, getMaterials, attach, detach, getRequestDataMaterials } =
  useUploadMaterials('category')

const { is_data_loaded, apply, default_fields } = useEditorView({
  router,
  fetchGetEntity: fetchGetInfrastructureCategoryItem,
  back_route_name: 'infrastructure_category_list',
  default_fields: true,
  apply: {
    create: {
      fetchCreateEntity: fetchCreateInfrastructureCategoryItem,
      beforeResponseFn: async () => checkForCompletionRequiredFields(!name.value || !complex_uid.value),
      afterResponseFn: async (response) => {
        await attach(response.uid)
      },
      success_message: 'Категория успешно создана'
    },
    update: {
      fetchUpdateEntity: fetchUpdateInfrastructureCategoryItem,
      beforeResponseFn: async () => {
        const uid = router.currentRoute.value.params.uid as string

        await detach(uid)
        await attach(uid)
      }
    }
  },
  setFormData: (form_data) => {
    getMaterials(form_data.media)

    name.value = form_data.name
    complex_uid.value = form_data.complex_uid
  },
  getRequestData: () => ({
    ...getRequestDataMaterials(),
    name: name.value,
    complex_uid: complex_uid.value
  }),
  mount: {
    create: {
      app_header_props: {
        title: `Добавить Категорию`,
        breadcrumbs: [
          {
            label: 'Инфраструктура'
          },
          {
            label: 'Категории',
            route: getHandleBackArgs('infrastructure_category_list')
          },
          { label: 'Добавить категорию' }
        ]
      }
    },
    common: {
      app_header_props: ([response_infrastructure_category]) => {
        const complex = refs.value.complexes.find((i) => i.value === complex_uid.value)

        return {
          title: complex
            ? `${complex.label} / ${response_infrastructure_category.name}`
            : `${response_infrastructure_category.name}`,
          breadcrumbs: [
            {
              label: 'Инфраструктура'
            },
            {
              label: 'Категории',
              route: getHandleBackArgs('infrastructure_category_list')
            },
            {
              label: complex
                ? `${complex.label} / ${response_infrastructure_category.name}`
                : `${response_infrastructure_category.name}`
            }
          ]
        }
      }
    }
  }
})

const name = ref('')
const complex_uid = ref<string>('')
</script>

<template>
  <FormLayout v-if="is_data_loaded" :apply="apply">
    <div class="InfrastructureCategoryEditorView">
      <DefaultFormFields v-model="default_fields" is_show_dates />

      <div class="InfrastructureCategoryEditorView__boxFields1 gridForm">
        <PskInput style="grid-column: span 2" v-model="name" label="Название" required placeholder="Введите название" />
      </div>
      <div class="InfrastructureCategoryEditorView__boxFields2 gridForm">
        <h3 class="FlatEditorView__boxFields2H1">О категории</h3>
        <PskSelect
          style="grid-column: span 2"
          v-model="complex_uid"
          label="Жилой комплекс"
          options_label="label"
          options_value="value"
          required
          :options="refs.complexes"
        />
        <UploadMedia style="grid-column: span 3" v-model="materials" :types="material_type_options" />
      </div>
    </div>
  </FormLayout>
</template>

<style lang="scss">
.InfrastructureCategoryEditorView {
  height: 100%;
}

.InfrastructureCategoryEditorView__boxFields1 {
  margin: 20px 0 0 0;
}

.InfrastructureCategoryEditorView__boxFields2 {
}

.FlatEditorView__boxFields2H1 {
  @include setFontStyle6();

  margin: 50px 0 10px 0;
  grid-column: span 3;
}

.InfrastructureCategoryEditorView__FormSite {
  margin: 20px 0 0 0;
}

.InfrastructureCategoryEditorView__h1 {
  @include setFontStyle6();
  margin: 50px 0 30px 0;
}
</style>
