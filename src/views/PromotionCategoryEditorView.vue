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
    form.value = Object.entries(form_data.form ?? getDefaultValuesFormFields()).reduce(
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
    <PskGridContainer grid-column-count="3">
      <DefaultFormFields v-model="default_fields" is_show_dates />

      <PskInput v-model="name" label="Название" required placeholder="Введите название" class="span-2" />
      <PskGridContainer grid-column-count="3" grid-span="2">
        <PskSelect
          v-model="complex_uid"
          label="Жилой комплекс"
          options_label="label"
          options_value="value"
          required
          :options="refs.complexes"
          class="span-2"
        />
        <PskInput v-model="anchor_link" label="якорная ссылка" required placeholder="Введите название" />
      </PskGridContainer>
      <PskSwitch class="span-3" label="Показывать форму?" v-model="show_form" />
      <PskGridContainer v-if="show_form" grid-span="2" grid-column-count="1">
        <PskInput v-model="form.button_label" label="Текст кнопки в блоке promotion" />
        <PskInput v-model="form.header_text" label="Заголовок формы" />
        <PskInput v-model="form.content_text" label="Текст в форме" type="textarea" />
        <PskInput v-model="form.button_text" label="Текст кнопки в форме" />
      </PskGridContainer>
      <PskWYSIWYGEditor label="Описание" v-model="description" />
    </PskGridContainer>
  </FormLayout>
</template>
