<script setup lang="ts">
import { Warning } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import FormLayout from '@/layouts/FormLayout.vue'

import useEditorView from '@/composables/app/useEditorView'

import {
  fetchCreateApiFlatPropsItem,
  fetchGetApiFlatPropsItem,
  fetchUpdateApiFlatPropsItem
} from '@/services/REST/dom_admin/api_flat_props'

import getHandleBackArgs from '@/helpers/getHandleBackArgs'
import getNumString from '@/helpers/getNumString'

const router = useRouter()
const { is_data_loaded, apply } = useEditorView({
  router,
  fetchGetEntity: fetchGetApiFlatPropsItem,
  back_route_name: 'flat_properties_list',
  apply: {
    create: {
      fetchCreateEntity: fetchCreateApiFlatPropsItem,
      success_message: 'Свойство успешно создано'
    },
    update: {
      fetchUpdateEntity: fetchUpdateApiFlatPropsItem
    }
  },
  setFormData: (form_data) => {
    title.value = form_data.title || ''
    public_title.value = form_data.public_title || ''
    description.value = form_data.description || ''
    code.value = form_data.code || ''
    sort.value = getNumString(form_data.sort)
    active.value = !!form_data.active
    filterable.value = !!form_data.filterable
    is_chess_visible.value = !!form_data.is_chess_visible
    is_public.value = !!form_data.is_public
    is_promo.value = !!form_data.is_promo
    view_mode.value = getNumString(form_data.view_mode)
    images_data.value = form_data.images_data || []
    chess_view_data.value = form_data.chess_view_data ?? chess_view_data.value
    active_at.value = form_data.active_at ? new Date(form_data.active_at) : null
    inactive_at.value = form_data.inactive_at ? new Date(form_data.inactive_at) : null
    created_at.value = form_data.created_at ? new Date(form_data.created_at) : null
    updated_at.value = form_data.updated_at ? new Date(form_data.updated_at) : null
    deleted_at.value = form_data.deleted_at ? new Date(form_data.deleted_at) : null
  },
  getRequestData: () => ({
    title: title.value,
    public_title: public_title.value,
    description: description.value,
    code: code.value,
    sort: sort.value && +sort.value,
    active: active.value,
    filterable: filterable.value,
    is_chess_visible: is_chess_visible.value,
    is_public: is_public.value,
    is_promo: is_promo.value,
    view_mode: view_mode.value && +view_mode.value,
    images_data: images_data.value,
    chess_view_data: chess_view_data.value,
    active_at: active_at.value,
    inactive_at: inactive_at.value,
    created_at: created_at.value,
    updated_at: updated_at.value,
    deleted_at: deleted_at.value
  }),
  mount: {
    create: {
      app_header_props: {
        title: 'Добавить свойство',
        breadcrumbs: [
          {
            label: 'Управление API'
          },
          {
            label: 'Свойства квартир',
            route: getHandleBackArgs('flat_properties_list')
          },
          { label: 'Добавить свойство' }
        ]
      }
    },
    common: {
      app_header_props: ([response_flat_property]) => ({
        title: response_flat_property.title,
        breadcrumbs: [
          {
            label: 'Управление API'
          },
          {
            label: 'Свойства квартир',
            route: getHandleBackArgs('flat_properties_list')
          },
          { label: response_flat_property.title }
        ]
      })
    }
  }
})

const title = ref('')
const public_title = ref('')
const description = ref('')
const code = ref('')
const sort = ref('')
const active = ref(false)
const filterable = ref(false)
const is_chess_visible = ref(false)
const is_public = ref(false)
const is_promo = ref(false)
const view_mode = ref('1')
const images_data = ref([])
const chess_view_data = ref({
  position: 'list',
  sign: {
    type: 'color',
    value: ''
  }
})
const active_at = ref<Date | null>()
const inactive_at = ref<Date | null>()
const created_at = ref<Date | null>()
const updated_at = ref<Date | null>()
const deleted_at = ref<Date | null>()

const sign_types = ['color', 'icon']

const handleSignType = (item: string) => {
  chess_view_data.value.sign.type = item
  chess_view_data.value.sign.value = ''
}
</script>

<template>
  <FormLayout v-if="is_data_loaded" :apply="apply">
    <div class="FlatPropsEditorView">
      <div class="DefaultFormFields gridForm">
        <div class="DefaultFormFields__row1">
          <div class="DefaultFormFields__show">
            <PskSwitch label="Активен" v-model="active" />
          </div>

          <PskDate v-model="active_at" label="Начало активности">
            <el-popover placement="top" trigger="hover" width="fit-content">
              <template #reference>
                <el-icon class="iconHover_default" style="font-size: 16px">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_355_1388)">
                      <rect width="20" height="20" rx="10" fill="#4670A7" />
                      <path
                        d="M8.96875 12.2246V11.8691C8.96875 11.5046 9.00293 11.1924 9.07129 10.9326C9.13965 10.6683 9.25814 10.4222 9.42676 10.1943C9.59993 9.96647 9.83919 9.72493 10.1445 9.46973C10.5 9.1735 10.7803 8.92285 10.9854 8.71777C11.195 8.50814 11.3454 8.2985 11.4365 8.08887C11.5277 7.87923 11.5732 7.6263 11.5732 7.33008C11.5732 6.85612 11.4206 6.49382 11.1152 6.24316C10.8099 5.98796 10.3792 5.86035 9.82324 5.86035C9.37207 5.86035 8.97103 5.91732 8.62012 6.03125C8.26921 6.14518 7.93197 6.2819 7.6084 6.44141L7.21191 5.52539C7.58561 5.32943 7.99121 5.16992 8.42871 5.04688C8.86621 4.92383 9.35384 4.8623 9.8916 4.8623C10.7712 4.8623 11.4525 5.08105 11.9355 5.51855C12.4186 5.9515 12.6602 6.5485 12.6602 7.30957C12.6602 7.7334 12.5918 8.0957 12.4551 8.39648C12.3184 8.69271 12.1247 8.96615 11.874 9.2168C11.6234 9.46289 11.3271 9.72493 10.9854 10.0029C10.6846 10.2581 10.4544 10.4837 10.2949 10.6797C10.1354 10.8711 10.026 11.0693 9.9668 11.2744C9.90755 11.4749 9.87793 11.7165 9.87793 11.999V12.2246H8.96875ZM8.66797 14.2891C8.66797 13.9701 8.74316 13.7445 8.89355 13.6123C9.04395 13.4756 9.23763 13.4072 9.47461 13.4072C9.69792 13.4072 9.88704 13.4756 10.042 13.6123C10.2015 13.7445 10.2812 13.9701 10.2812 14.2891C10.2812 14.6035 10.2015 14.8337 10.042 14.9795C9.88704 15.1208 9.69792 15.1914 9.47461 15.1914C9.23763 15.1914 9.04395 15.1208 8.89355 14.9795C8.74316 14.8337 8.66797 14.6035 8.66797 14.2891Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_355_1388">
                        <rect width="20" height="20" rx="10" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </el-icon>
              </template>
              Укажите заданное время для активации
            </el-popover>
          </PskDate>
          <PskDate v-model="inactive_at" label="Конец активности">
            <el-popover placement="top" trigger="hover" width="fit-content">
              <template #reference>
                <el-icon class="iconHover_default" style="font-size: 16px">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_355_1388)">
                      <rect width="20" height="20" rx="10" fill="#4670A7" />
                      <path
                        d="M8.96875 12.2246V11.8691C8.96875 11.5046 9.00293 11.1924 9.07129 10.9326C9.13965 10.6683 9.25814 10.4222 9.42676 10.1943C9.59993 9.96647 9.83919 9.72493 10.1445 9.46973C10.5 9.1735 10.7803 8.92285 10.9854 8.71777C11.195 8.50814 11.3454 8.2985 11.4365 8.08887C11.5277 7.87923 11.5732 7.6263 11.5732 7.33008C11.5732 6.85612 11.4206 6.49382 11.1152 6.24316C10.8099 5.98796 10.3792 5.86035 9.82324 5.86035C9.37207 5.86035 8.97103 5.91732 8.62012 6.03125C8.26921 6.14518 7.93197 6.2819 7.6084 6.44141L7.21191 5.52539C7.58561 5.32943 7.99121 5.16992 8.42871 5.04688C8.86621 4.92383 9.35384 4.8623 9.8916 4.8623C10.7712 4.8623 11.4525 5.08105 11.9355 5.51855C12.4186 5.9515 12.6602 6.5485 12.6602 7.30957C12.6602 7.7334 12.5918 8.0957 12.4551 8.39648C12.3184 8.69271 12.1247 8.96615 11.874 9.2168C11.6234 9.46289 11.3271 9.72493 10.9854 10.0029C10.6846 10.2581 10.4544 10.4837 10.2949 10.6797C10.1354 10.8711 10.026 11.0693 9.9668 11.2744C9.90755 11.4749 9.87793 11.7165 9.87793 11.999V12.2246H8.96875ZM8.66797 14.2891C8.66797 13.9701 8.74316 13.7445 8.89355 13.6123C9.04395 13.4756 9.23763 13.4072 9.47461 13.4072C9.69792 13.4072 9.88704 13.4756 10.042 13.6123C10.2015 13.7445 10.2812 13.9701 10.2812 14.2891C10.2812 14.6035 10.2015 14.8337 10.042 14.9795C9.88704 15.1208 9.69792 15.1914 9.47461 15.1914C9.23763 15.1914 9.04395 15.1208 8.89355 14.9795C8.74316 14.8337 8.66797 14.6035 8.66797 14.2891Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_355_1388">
                        <rect width="20" height="20" rx="10" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </el-icon>
              </template>
              Укажите заданное время для деактивации
            </el-popover>
          </PskDate>
          <PskInput class="DefaultFormFields__inputWeight" v-model="sort" label="Сортировка" required type="number" />
        </div>

        <div class="DefaultFormFields__row2">
          <PskDate placeholder="" v-model="created_at" label="Дата создания" use_time disabled />
          <PskDate placeholder="" v-model="updated_at" label="Дата обновления" use_time disabled />
        </div>
      </div>

      <div class="span-3" class="FlatPropsEditorView__boxFields1 gridForm">
        <PskInput
          style="grid-column: span 2"
          v-model="title"
          label="Название"
          required
          placeholder="Введите название"
        />
        <PskInput v-model="public_title" label="Публичное название" required placeholder="Введите название" />
      </div>

      <div class="span-3" class="FlatPropsEditorView__boxFields1 gridForm">
        <PskInput v-model="code" label="Код" placeholder="Введите название">
          <el-popover placement="top" trigger="hover" width="fit-content">
            <template #reference>
              <el-icon class="iconHover_default" style="font-size: 13px">
                <Warning />
              </el-icon>
            </template>
            Допустимые символы: латиница, "_", "/"
          </el-popover>
        </PskInput>
      </div>

      <div class="span-3" class="FlatPropsEditorView__boxFields2 gridForm">
        <h2 class="FlatEditorView__boxFields2H1">Настройки показа в шахматке ProfitDom'a</h2>
        <PskInput v-model="view_mode" label="Режим показа" placeholder="Введите число" type="number" />
        <PskSelect
          v-model="chess_view_data.position"
          label="Положение св-ва на шахматке квартиры"
          :options="['list', 'top-right']"
        />
        <PskTabSelect
          class="span-3"
          :model-value="chess_view_data.sign.type"
          @update:modelValue="handleSignType"
          :options="sign_types"
        />
        <div v-if="chess_view_data.sign.type === 'color'" style="display: flex; gap: 10px; align-items: center">
          <p style="font-family: 'Open Sans'; font-style: normal; font-weight: 400; font-size: 14px">Цветовая гамма</p>
          <el-color-picker color-format="hex" v-model="chess_view_data.sign.value" size="default" />
        </div>
        <PskInput
          v-if="chess_view_data.sign.type === 'icon'"
          v-model="chess_view_data.sign.value"
          label="Ссылка на иконку"
          placeholder="Вставьте ссылку"
        />
      </div>

      <div class="span-3" class="FlatPropsEditorView__boxFields2 gridForm">
        <PskSwitch v-model="filterable" label="Отображать в фильтре ПД" />
        <PskSwitch v-model="is_chess_visible" label="Отображать на шахматке ПД" />
        <PskSwitch v-model="is_public" label="Показывать на публичных ресурсах" />
        <PskSwitch v-model="is_promo" label="Отображать как промо в каталоге квартир" />
      </div>

      <PskMultiString
        label="Картинки"
        style="grid-column: span 3; margin-bottom: 20px"
        btn_label="Добавить ссылку на картинку"
        placeholder="Вставьте ссылку"
        v-model="images_data"
      />

      <PskWYSIWYGEditor label="Описание" v-model="description" />
    </div>
  </FormLayout>
</template>

<style lang="scss">
.FlatPropsEditorView {
  height: 100%;
}

.FlatPropsEditorView__boxFields1 {
  margin-top: 20px;
}

.FlatPropsEditorView__boxFields2 {
  margin-bottom: 20px;
}

.FlatEditorView__boxFields2H1 {
  @include setFontStyle6();

  margin: 50px 0 20px 0;
  grid-column: span 3;
}

.FlatPropsEditorView__FormSite {
  margin: 20px 0 0 0;
}

.FlatPropsEditorView__h1 {
  @include setFontStyle6();
  margin: 50px 0 30px 0;
}
</style>
