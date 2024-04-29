<script setup lang="ts">
import { Warning } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import FormLayout from '@/layouts/FormLayout.vue'

import DefaultFormFields from '@/components/DefaultFormFields.vue'

import useEditorView from '@/composables/app/useEditorView'
import useUploadImages from '@/composables/app/useUploadImages'

import { type IPlanMain, fetchGetPlanMain, fetchUpdatePlanMain } from '@/services/REST/dom_admin/plans_main'

import getHandleBackArgs from '@/helpers/getHandleBackArgs'
import getNumString from '@/helpers/getNumString'

const router = useRouter()

const { images, getRequestImages, getImages } = useUploadImages()

const { is_data_loaded, apply, default_fields } = useEditorView({
  router,
  fetchGetEntity: fetchGetPlanMain,
  back_route_name: 'plan_main_list',
  default_fields: true,
  apply: {
    request_data: getRequestImages,
    update: {
      fetchUpdateEntity: fetchUpdatePlanMain
    }
  },
  setFormData: (form_data) => {
    getImages(form_data.images)

    name.value = form_data.name || ''
    title_for_site.value = form_data.title_for_site || ''
    article.value = form_data.article || ''
    square.value = getNumString(form_data.square)
    video_review.value = form_data.video_review || ''
    rooms.value = getNumString(form_data.rooms)
    loggia_square.value = getNumString(form_data.loggia_square)
    tags.value = form_data.tags || tags.value
    analogs.value = convertAnalogs(form_data.analogs)
    properties.value = convertPropertiesForData(form_data.properties)
    description.value = form_data.description || ''
    sanitary_nodes_count.value = getNumString(form_data.sanitary_nodes_count)
    custom_squares.value = Object.entries(form_data.custom_squares).reduce(
      (acc, [key, val]) => Object.assign(acc, { [key]: getNumString(val) }),
      custom_squares.value
    )
    marketing_article.value = form_data.marketing_article || ''
    legal_text.value = form_data.legal_text || ''
    planoplan.value = form_data.planoplan || ''
  },
  getRequestData: () => ({
    images: images.value,
    name: name.value,
    title_for_site: title_for_site.value,
    article: article.value,
    rooms: rooms.value && +rooms.value,
    square: square.value && +square.value,
    loggia_square: loggia_square.value && +loggia_square.value,
    video_review: video_review.value,
    tags: tags.value.filter(Boolean),
    analogs: analogs.value,
    sanitary_nodes_count: sanitary_nodes_count.value,
    properties: convertPropertiesForRequest(properties.value),
    description: description.value,
    custom_squares: custom_squares.value,
    marketing_article: marketing_article.value,
    legal_text: legal_text.value,
    planoplan: planoplan.value
  }),
  mount: {
    common: {
      app_header_props: ([response_plan_main]) => ({
        title: `${response_plan_main.name}`,
        breadcrumbs: [
          { label: 'Планировки' },
          {
            label: 'Список',
            route: getHandleBackArgs('plan_main_list')
          },
          { label: `${response_plan_main.name}` }
        ]
      })
    }
  }
})

const name = ref('')
const title_for_site = ref('')
const article = ref('')
const rooms = ref('')
const square = ref('')
const loggia_square = ref('')
const analogs = ref<Record<string, string>>({ center: '', secondary: '' })
const custom_squares = ref<IPlanMain['custom_squares']>({ loggia_square: '', marketing_square: '' })
const tags = ref<IPlanMain['tags']>([])
const properties = ref<string[]>([])
const description = ref('')
const video_review = ref('')
const sanitary_nodes_count = ref('')
const marketing_article = ref('')
const legal_text = ref('')
const planoplan = ref('')

const convertAnalogs = (analogs: IPlanMain['analogs']) =>
  analogs.reduce((a: any, i: any) => Object.assign(a, { [i.code]: String(i.value || '') }), {}) || []
const convertPropertiesForRequest = (list: string[]): Record<string, boolean> =>
  list.filter(Boolean).reduce((acc, i) => Object.assign(acc, { [i]: true }), {})
const convertPropertiesForData = (obj: Record<string, boolean>): string[] => Object.keys(Object.assign({}, obj))
</script>

<template>
  <FormLayout :apply="apply" v-if="is_data_loaded">
    <div class="PlanMainEditorView">
      <DefaultFormFields v-model="default_fields" is_show_dates />

      <div class="PlanMainEditorView__boxFields1 gridForm">
        <PskInput v-model="name" style="grid-column: span 2" label="Название" disabled />

        <PskInput
          v-model="title_for_site"
          style="grid-column: span 2"
          label="Название для сайта"
          placeholder="Введите название"
        />
      </div>

      <div class="PlanMainEditorView__boxFields2-container">
        <div class="PlanMainEditorView__boxFields2">
          <h3 class="PlanMainEditorView__boxFields2H1" style="grid-column: span 3">О планировке</h3>

          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px; grid-column: span 3">
            <PskInput v-model="article" label="Артикул" disabled />
            <PskInput v-model="marketing_article" label="Маркетинговый артикул" placeholder="Введите название" />
          </div>
          <PskInput v-model="square" label="Площадь по декларации, м²" disabled type="number" />
          <PskInput v-model="custom_squares.marketing_square" label="Маркетинговая площадь, м²" type="number">
            <el-popover placement="top" trigger="hover" width="fit-content">
              <template #reference>
                <el-icon class="iconHover_default" style="font-size: 13px">
                  <Warning />
                </el-icon>
              </template>
              Если заполнено поле Маркетинговая площадь, то оно является приоритетным <br />
              в качестве передачи в фид как атрибута Площадь квартиры
            </el-popover>
          </PskInput>
          <PskInput v-model="custom_squares.loggia_square" label="Площадь лоджии, м²" type="number">
            <el-popover placement="top" trigger="hover" width="fit-content">
              <template #reference>
                <el-icon class="iconHover_default" style="font-size: 13px">
                  <Warning />
                </el-icon>
              </template>
              Если заполнено поле Маркетинговая площадь, то оно является приоритетным <br />
              в качестве передачи в фид как атрибута Площадь квартиры
            </el-popover>
          </PskInput>
          <PskWYSIWYGEditor label="Лигл" :required="!!custom_squares.marketing_square" v-model="legal_text" />
          <PskInput v-model="rooms" label="Кол-во комнат" disabled type="number" />
          <PskMultiString v-model="tags" label="Теги" btn_label="Добавить тег" style="grid-column: span 3" />
          <PskMultiString
            v-model="properties"
            label="Свойства"
            btn_label="Добавить свойство"
            style="grid-column: span 3"
          />
        </div>
      </div>

      <div class="PlanMainEditorView__boxFields2">
        <PskInput v-model="analogs.center" label="Аналог в центре, ₽" type="cash" />
        <PskInput v-model="analogs.secondary" label="Аналог рядом на вторичном рынке, ₽" type="cash" />
        <PskInput
          v-model="video_review"
          label="Видеообзор"
          placeholder="Введите/вставьте ссылку"
          style="grid-column: span 3"
        />
        <PskInput
          v-model="planoplan"
          label="Виджет планоплан"
          style="grid-column: span 3"
          placeholder="Вставьте ссылку на виджет"
        />
        <PskWYSIWYGEditor v-model="description" label="Описание" style="grid-column: span 3" />
      </div>

      <UploadImg v-model="images" class="PlanMainEditorView__UploadImg" :limit="10" />
    </div>
  </FormLayout>
</template>

<style lang="scss">
.PlanMainEditorView {
  height: 100%;
}

.PlanMainEditorView__boxFields1 {
  margin: 20px 0 0 0;
}

.PlanMainEditorView__boxFields2H1,
.PlanMainEditorView__boxFields3H1,
.PlanMainEditorView__boxFields4H1 {
  @include setFontStyle6();
  margin: 50px 0 10px 0;
  grid-column: span 3;
}

.PlanMainEditorView__boxFields2 {
  grid-column: span 3;
  display: grid;
  gap: 20px 30px;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: end;
  margin-bottom: 20px;
}

.PlanMainEditorView__boxFields2-container {
  grid-column: span 3;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.PlanMainEditorView__UploadImg {
  margin: 30px 0 50px 0;
}

.PlanMainEditorView__switchList {
  grid-column: span 3;

  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>
