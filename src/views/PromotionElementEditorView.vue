<script setup lang="ts">
import { Warning } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import FormLayout from '@/layouts/FormLayout.vue'

import DefaultFormFields from '@/components/DefaultFormFields.vue'

import useEditorView from '@/composables/app/useEditorView'
import useRefs from '@/composables/app/useRefs'
import useUploadMaterials from '@/composables/app/useUploadMaterials'

import {
  fetchCreatePromotionElementItem,
  fetchGetPromotionElementItem,
  fetchUpdatePromotionElementItem
} from '@/services/REST/dom_admin/promotion_element'

import getHandleBackArgs from '@/helpers/getHandleBackArgs'
import getNumString from '@/helpers/getNumString'

const router = useRouter()
const refs = useRefs('complexes-with-promotion-categories')
const { material_type_options, materials, getMaterials, attach, detach, getRequestDataMaterials } =
  useUploadMaterials('prom_element')

const { is_data_loaded, apply, default_fields } = useEditorView({
  router,
  fetchGetEntity: fetchGetPromotionElementItem,
  back_route_name: 'promotion_element_list',
  default_fields: true,
  apply: {
    create: {
      fetchCreateEntity: fetchCreatePromotionElementItem,
      success_message: 'Объект успешно создан',
      afterResponseFn: async (response) => {
        await attach(response.uid)
      }
    },
    update: {
      fetchUpdateEntity: fetchUpdatePromotionElementItem,
      beforeResponseFn: async () => {
        await detach(router.currentRoute.value.params.uid as string)
        await attach(router.currentRoute.value.params.uid as string)
      }
    }
  },
  setFormData: (form_data) => {
    getMaterials(form_data.media)

    name.value = form_data.name || ''
    anchor_link.value = form_data.anchor_link || ''
    prom_category_uid.value = form_data.prom_category_uid || ''
    tags.value = form_data.tags.filter(Boolean) || []
    availability_percent.value = getNumString(form_data.availability_percent)
    square.value = getNumString(form_data.square)
    deadline.value = form_data.deadline || ''
    mortgage_name.value = form_data.mortgage_name || ''
    mortgage_rate.value = getNumString(form_data.mortgage_rate)
    mortgage_term.value = getNumString(form_data.mortgage_term)
    payment.value = getNumString(form_data.payment)
    old_mortgage_rate.value = getNumString(form_data.old_mortgage_rate)
    old_payment.value = getNumString(form_data.old_payment)
    discount.value = getNumString(form_data.discount)
    discount_text.value = form_data.discount_text || ''
    text_tooltip.value = form_data.text_tooltip || ''
    description.value = form_data.description || ''

    form.value = Object.entries(form_data.form).reduce(
      (acc, [key, val]) => ({
        ...acc,
        [key]: val || form.value[key as keyof typeof form.value]
      }),
      Object.create(null)
    )
  },
  getRequestData: () => ({
    ...getRequestDataMaterials(),
    name: name.value,
    anchor_link: anchor_link.value,
    prom_category_uid: Array.isArray(prom_category_uid.value) ? prom_category_uid.value[1] : prom_category_uid.value,
    tags: tags.value,
    availability_percent: availability_percent.value,
    square: square.value,
    deadline: deadline.value,
    mortgage_name: mortgage_name.value,
    mortgage_rate: mortgage_rate.value,
    mortgage_term: mortgage_term.value,
    payment: payment.value,
    old_mortgage_rate: old_mortgage_rate.value,
    old_payment: old_payment.value,
    discount: discount.value,
    discount_text: discount_text.value,
    text_tooltip: text_tooltip.value,
    form: form.value,
    description: description.value
  }),
  mount: {
    create: {
      app_header_props: {
        title: `Добавить Объект`,
        breadcrumbs: [
          { label: 'Акционные блоки' },
          {
            label: 'Объекты',
            route: getHandleBackArgs('promotion_element_list')
          },
          { label: `Добавить Объект` }
        ]
      }
    },
    common: {
      app_header_props: () => ({
        breadcrumbs: [{ label: 'Акционные блоки' }],
        optionalCallback: (app_header_state) => {
          for (const complex of refs.value.complexes_with_promotion_categories) {
            const promotion_category = complex.children.find((i) => i.value === prom_category_uid.value)

            if (promotion_category) {
              app_header_state.title = `${name.value} (${promotion_category.label} / ${complex.label})`
              app_header_state.breadcrumbs.push({
                label: 'Объекты',
                route: getHandleBackArgs('promotion_element_list')
              })
              app_header_state.breadcrumbs.push({
                label: `${name.value} (${promotion_category.label} / ${complex.label})`
              })
              break
            }
          }

          !app_header_state.title && (app_header_state.title = name.value)
          app_header_state.breadcrumbs.length === 1 &&
            app_header_state.breadcrumbs.push(
              {
                label: 'Объекты',
                route: getHandleBackArgs('promotion_element_list')
              },
              { label: name.value }
            )
        }
      })
    }
  }
})

const getDefaultValuesFormFields = () => ({ button_label: '', header_text: '', content_text: '', button_text: '' })

const name = ref('')
const anchor_link = ref('')
const prom_category_uid = ref('')
const tags = ref<string[]>([])
const availability_percent = ref('')
const square = ref('')
const deadline = ref('')
const mortgage_name = ref('')
const mortgage_rate = ref('')
const mortgage_term = ref('')
const payment = ref('')
const old_mortgage_rate = ref('')
const old_payment = ref('')
const discount = ref('')
const discount_text = ref('')
const text_tooltip = ref('')
const form = ref(getDefaultValuesFormFields())
const description = ref('')
</script>

<template>
  <FormLayout v-if="is_data_loaded" :apply="apply">
    <div class="PromotionElementEditorView">
      <DefaultFormFields v-model="default_fields" is_show_dates />

      <div class="PromotionElementEditorView__boxFields1 gridForm">
        <PskInput style="grid-column: span 2" v-model="name" label="Название" required placeholder="Введите название" />

        <PskInput v-model="anchor_link" required label="Якорная ссылка" placeholder="Введите якорную ссылку">
          <el-popover placement="top" trigger="hover" width="fit-content">
            <template #reference>
              <el-icon class="iconHover_default" style="font-size: 13px">
                <Warning />
              </el-icon>
            </template>
            Конечный результат будет: якорная_ссылка(промо-категория)_якорная_ссылка(промо-объект)
          </el-popover>
        </PskInput>

        <PskCascader
          style="grid-column: span 2"
          v-model="prom_category_uid"
          :options="refs.complexes_with_promotion_categories"
          label="Категория"
          required
          placeholder="Выберите категорию"
        />

        <div></div>
        <PskMultiString
          style="grid-column: span 3"
          v-model="tags"
          btn_label="Добавить тэг"
          label="Тэги"
        ></PskMultiString>

        <PskInput v-model="availability_percent" label="Процент доступности" placeholder="Введите значение" />
        <PskInput v-model="square" label="Площадь" placeholder="Введите значение" />
        <PskInput v-model="deadline" label="Срок сдачи" placeholder="Введите значение" />
        <PskInput v-model="mortgage_name" label="Название ипотеки" placeholder="Введите название" />
        <PskInput v-model="mortgage_rate" label="Ставка ипотеки" placeholder="Введите значение" />
        <PskInput v-model="mortgage_term" label="Срок ипотеки" placeholder="Введите значение" />
        <PskInput v-model="payment" label="Платеж" placeholder="Введите значение" />
        <PskInput v-model="old_mortgage_rate" label="Старая ставка ипотеки" placeholder="Введите значение" />
        <PskInput v-model="old_payment" label="Старый платеж" placeholder="Введите значение" />
        <PskInput v-model="discount" label="Скидка" placeholder="Введите значение" />
        <PskInput v-model="discount_text" label="Заголовок скидки" placeholder="Введите заголовок" />
        <div></div>
        <PskInput
          style="grid-column: span 2"
          v-model="text_tooltip"
          type="textarea"
          label="Описание для тултипа"
          placeholder="Введите описание"
        />
        <div></div>
        <PskWYSIWYGEditor style="grid-column: span 3" v-model="description" label="Описание" />
        <div style="grid-column: span 2" class="gridForm">
          <PskInput style="grid-column: span 3" v-model="form.button_label" label="Текст кнопки в карточке" />
          <PskInput style="grid-column: span 3" v-model="form.header_text" label="Заголовок формы" />
          <PskInput type="textarea" style="grid-column: span 3" v-model="form.content_text" label="Текст в форме" />
          <PskInput style="grid-column: span 3" v-model="form.button_text" label="Текст кнопки в форме" />
        </div>
      </div>

      <h1 class="PromotionElementEditorView__h1" v-if="$route.params.uid !== 'create'">Картинки</h1>
      <UploadMedia v-model="materials" :types="material_type_options" :limit="10" />
    </div>
  </FormLayout>
</template>

<style lang="scss">
.PromotionElementEditorView {
  height: 100%;
}

.PromotionElementEditorView__boxFields1 {
  margin: 20px 0 0 0;
}

.PromotionElementEditorView__FormSite {
  margin: 20px 0 0 0;
}

.PromotionElementEditorView__h1 {
  @include setFontStyle6();
  margin: 50px 0 30px 0;
}
</style>
