<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import FormLayout from '@/layouts/FormLayout.vue'

import DefaultFormFields from '@/components/DefaultFormFields.vue'

import useEditorView from '@/composables/app/useEditorView'
import useRefs from '@/composables/app/useRefs'

import {
  fetchCreatePromotionCategoryItem,
  fetchGetPromotionCategoryItem,
  fetchUpdatePromotionCategoryItem
} from '@/services/REST/dom_admin/promotion_category'

import getHandleBackArgs from '@/helpers/getHandleBackArgs'

const router = useRouter()
const refs = useRefs('complexes')
const { apply, is_data_loaded, default_fields } = useEditorView({
  router,
  fetchGetEntity: fetchGetPromotionCategoryItem,
  back_route_name: 'promotion_category_list',
  default_fields: true,
  apply: {
    update: {
      fetchUpdateEntity: fetchUpdatePromotionCategoryItem
    },
    create: {
      fetchCreateEntity: fetchCreatePromotionCategoryItem,
      success_message: 'Категория успешно создана'
    }
  },
  setFormData: (form_data) => {
    name.value = form_data.name || ''
    complex_uid.value = form_data.complex_uid || ''
    anchor_link.value = form_data.anchor_link || ''
    description.value = form_data.description || ''
    form.value = Object.entries(form_data.form).reduce(
      (acc, [key, val]) => ({
        ...acc,
        [key]: val || form.value[key as keyof typeof form.value]
      }),
      Object.create(null)
    )
    show_form.value = !!form_data.show_form
  },
  getRequestData: () => ({
    name: name.value,
    complex_uid: complex_uid.value,
    anchor_link: anchor_link.value,
    description: description.value,
    form: show_form.value ? form.value : getDefaultValuesFormFields(),
    show_form: show_form.value
  }),
  mount: {
    create: {
      app_header_props: {
        title: `Добавить Категорию`,
        breadcrumbs: [
          {
            label: 'Акционные блоки'
          },
          {
            label: 'Категории',
            route: getHandleBackArgs('promotion_category_list')
          },
          { label: 'Добавить категорию' }
        ]
      }
    },
    common: {
      app_header_props: ([response_promotion_category]) => {
        const complex = refs.value.complexes.find((i) => i.value === complex_uid.value)

        return {
          title: complex
            ? `${complex.label} / ${response_promotion_category.name}`
            : `${response_promotion_category.name}`,
          breadcrumbs: [
            {
              label: 'Акционные блоки'
            },
            {
              label: 'Категории',
              route: getHandleBackArgs('promotion_category_list')
            },
            {
              label: complex
                ? `${complex.label} / ${response_promotion_category.name}`
                : `${response_promotion_category.name}`
            }
          ]
        }
      }
    }
  }
})

const getDefaultValuesFormFields = () => ({ button_label: '', header_text: '', content_text: '', button_text: '' })

const name = ref('')
const form = ref(getDefaultValuesFormFields())
const complex_uid = ref<string>('')
const anchor_link = ref('')
const description = ref('')
const show_form = ref(false)
</script>

<template>
  <FormLayout v-if="is_data_loaded" :apply="apply">
    <div class="PromotionCategoryEditorView">
      <DefaultFormFields v-model="default_fields" is_show_dates />

      <div class="PromotionCategoryEditorView__boxFields1 gridForm">
        <PskInput style="grid-column: span 2" v-model="name" label="Название" required placeholder="Введите название" />
        <div style="grid-column: span 2; display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px">
          <PskSelect
            style="grid-column: span 2"
            v-model="complex_uid"
            label="Жилой комплекс"
            options_label="label"
            options_value="value"
            required
            :options="refs.complexes"
          />
          <PskInput v-model="anchor_link" label="якорная ссылка" required placeholder="Введите название" />
        </div>
      </div>
      <div class="PromotionCategoryEditorView__boxFields2 gridForm">
        <PskSwitch style="grid-column: span 3" label="Показывать форму?" v-model="show_form" />
        <div v-if="show_form" style="grid-column: span 2" class="gridForm">
          <PskInput style="grid-column: span 3" v-model="form.button_label" label="Текст кнопки в блоке promotion" />
          <PskInput style="grid-column: span 3" v-model="form.header_text" label="Заголовок формы" />
          <PskInput type="textarea" style="grid-column: span 3" v-model="form.content_text" label="Текст в форме" />
          <PskInput style="grid-column: span 3" v-model="form.button_text" label="Текст кнопки в форме" />
        </div>
      </div>
      <PskWYSIWYGEditor label="Описание" v-model="description" />
    </div>
  </FormLayout>
</template>

<style lang="scss">
.PromotionCategoryEditorView {
  height: 100%;
}

.PromotionCategoryEditorView__boxFields1 {
  margin: 20px 0 0 0;
}

.PromotionCategoryEditorView__boxFields2 {
  margin: 20px 0;
}

.FlatEditorView__boxFields2H1 {
  @include setFontStyle6();

  margin: 50px 0 10px 0;
  grid-column: span 3;
}

.PromotionCategoryEditorView__FormSite {
  margin: 20px 0 0 0;
}

.PromotionCategoryEditorView__h1 {
  @include setFontStyle6();
  margin: 50px 0 30px 0;
}
</style>
