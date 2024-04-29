<script setup lang="ts">
import { Warning } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import FormLayout from '@/layouts/FormLayout.vue'

import DefaultFormFields from '@/components/DefaultFormFields.vue'

import useEditorView from '@/composables/app/useEditorView'
import useRefs from '@/composables/app/useRefs'

import { type IFeed, fetchCreateFeed, fetchGetFeed, fetchUpdateFeed } from '@/services/REST/dom_admin/feed'

import copyText from '@/utils/copyText'

import getHandleBackArgs from '@/helpers/getHandleBackArgs'

const router = useRouter()
const refs = useRefs(
  'complexes-with-houses',
  'margin-groups',
  'real-property-types',
  'real-property-square-types',
  'merged-price-types',
  'feed-settings-type',
  'real-property-statuses'
)

const { apply, is_data_loaded, default_fields } = useEditorView({
  router,
  fetchGetEntity: fetchGetFeed,
  back_route_name: 'feed_list',
  default_fields: true,
  apply: {
    update: {
      fetchUpdateEntity: fetchUpdateFeed
    },
    create: {
      fetchCreateEntity: fetchCreateFeed,
      success_message: 'Фид успешно создан'
    }
  },
  setFormData: (form_data) => {
    name.value = form_data.name
    settings_type.value = form_data.settings_type
    price_type.value = Object.values(form_data.settings?.price)
    settings.value = form_data.settings
    houses.value = form_data.houses
    file_url.value = form_data.file_url || ''
    type.value = form_data.type
  },
  getRequestData: () => ({
    name: name.value,
    settings_type: settings_type.value,
    settings: { ...settings.value, price: { uid: price_type.value?.[1] ?? '', type: price_type.value?.[0] ?? '' } },
    houses: houses.value.map((i) => (Array.isArray(i) ? i[1] : i)),
    file_url: file_url.value,
    type: type.value
  }),
  mount: {
    create: {
      app_header_props: {
        title: `Добавить фид`,
        breadcrumbs: [
          {
            label: 'Управление фидами',
            route: getHandleBackArgs('feed_list')
          },
          { label: `Добавить фид` }
        ]
      }
    },
    common: {
      app_header_props: ([response_feed]) => ({
        title: response_feed.name,
        breadcrumbs: [
          {
            label: 'Управление фидами',
            route: getHandleBackArgs('feed_list')
          },
          { label: response_feed.name }
        ]
      })
    }
  }
})

const name = ref('')
const settings_type = ref<IFeed['settings_type']>('PERSONAL')
const price_type = ref([])
const settings = ref<IFeed['settings']>({
  flat_types: [],
  marginal_groups: [],
  statuses: ['Свободна', 'Бронь', 'Оформление'],
  price: {
    uid: '',
    type: ''
  },
  square_type: ''
})
const houses = ref([])
const file_url = ref('')
const type = ref('')

const alertText: Record<IFeed['settings_type'], string> = {
  PERSONAL:
    'Для этого фида параметры выгрузки квартир управляются в Квартирах полями: "Статус выгрузки", "Какой тип цены выгружать", "Какой тип площади выгружать"',
  GLOBAL: 'Для этого фида игнорируются принудительные настройки выгрузки. Выборка производится по глобальной настройке'
}

const feed_type_list = [
  { value: 'cian', label: 'Циан' },
  { value: 'avito', label: 'Авито' },
  { value: 'yandex', label: 'Яндекс.Недвижимость' },
  { value: 'dom_click', label: 'ДомКлик' }
]
</script>

<template>
  <FormLayout v-if="is_data_loaded" :apply="apply">
    <div class="FeedEditorView">
      <DefaultFormFields v-model="default_fields" is_show_dates />

      <div class="FeedEditorView__boxFields1 gridForm">
        <PskInput style="grid-column: span 2" v-model="name" label="Название" required placeholder="Введите название" />
        <PskSelect
          label="Тип фида"
          v-model="type"
          :options="feed_type_list"
          required
          options_label="label"
          options_value="value"
          :disabled="$route.params.uid !== 'create'"
        />
      </div>

      <div class="FeedEditorView__boxFields2">
        <h3 class="FeedEditorView__boxFields2H1">Настройки</h3>
        <PskSelect
          v-model="settings_type"
          :options="refs.feed_settings_type"
          label="Тип настроек"
          options_label="label"
          options_value="value"
        />

        <PskAlert style="grid-column: span 2" v-if="settings_type" type="info" :text="alertText[settings_type]" />
        <PskSelect
          v-if="settings_type === 'GLOBAL'"
          v-model="settings.statuses"
          :options="refs.real_property_statuses"
          label="Какие статусы квартир выгружать"
          required
          multiple
        />
        <PskSelect
          v-if="settings_type === 'GLOBAL'"
          v-model="settings.flat_types"
          :options="refs.real_property_types"
          label="Какие типы объектов недвижимости выгружать"
          multiple
          required
          options_label="label"
          options_value="value"
        />
        <PskSelect
          v-if="settings_type === 'GLOBAL'"
          v-model="settings.marginal_groups"
          multiple
          required
          options_label="label"
          options_value="value"
          :options="refs.margin_groups"
          label="Какие группы маржинальности выгружать"
        />
        <PskCascader
          v-if="settings_type === 'GLOBAL'"
          v-model="price_type"
          required
          :options="refs.merged_price_types"
          label="Какой тип цены выгружать"
        />

        <PskSelect
          v-if="settings_type === 'GLOBAL'"
          v-model="settings.square_type"
          required
          :options="refs.real_property_square_types"
          label="Какой тип площади выгружать"
        >
          <el-popover placement="top" trigger="hover" width="fit-content">
            <template #reference>
              <el-icon class="iconHover_default" style="font-size: 13px">
                <Warning />
              </el-icon>
            </template>
            Если у квартиры заполнено поле Маркетинговая площадь, то оно является приоритетным <br />
            в качестве передачи в фид, как атрибута Площадь квартиры. Если пусто, то будет передано <br />
            значение поля Площадь по декларации.
          </el-popover>
        </PskSelect>

        <PskCascader
          v-model="houses"
          style="grid-column: span 2"
          label="ЖК и ГП"
          required
          multiple
          :options="refs.complexes_with_houses"
        />
        <PskInput v-if="file_url" v-model="file_url" style="grid-column: span 2" label="Ссылка на фид" disabled>
          <div @click="copyText(file_url)" style="cursor: pointer" title="Скопировать ссылку">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M12 13C11.9897 13.5627 11.7943 14.034 11.414 14.414C11.0337 14.794 10.5623 14.9893 10 15H3C2.43733 14.9897 1.966 14.7943 1.586 14.414C1.206 14.0337 1.01067 13.5623 1 13V6C1.01033 5.43733 1.20567 4.966 1.586 4.586C1.96633 4.206 2.43767 4.01067 3 4V5C2.71867 5.01033 2.48433 5.10933 2.297 5.297C2.10967 5.48467 2.01067 5.719 2 6V13C2.01033 13.2813 2.10933 13.5157 2.297 13.703C2.48467 13.8903 2.719 13.9893 3 14H10C10.2813 13.9897 10.5157 13.8907 10.703 13.703C10.8903 13.5153 10.9893 13.281 11 13H12ZM6 2C5.71867 2.01033 5.48433 2.10933 5.297 2.297C5.10967 2.48467 5.01067 2.719 5 3V10C5.01033 10.2813 5.10933 10.5157 5.297 10.703C5.48467 10.8903 5.719 10.9893 6 11H13C13.2813 10.9897 13.5157 10.8907 13.703 10.703C13.8903 10.5153 13.9893 10.281 14 10V3C13.9897 2.71867 13.8907 2.48433 13.703 2.297C13.5153 2.10967 13.281 2.01067 13 2H6ZM6 1H13C13.5627 1.01033 14.034 1.20567 14.414 1.586C14.794 1.96633 14.9893 2.43767 15 3V10C14.9897 10.5627 14.7943 11.034 14.414 11.414C14.0337 11.794 13.5623 11.9893 13 12H6C5.43733 11.9897 4.966 11.7943 4.586 11.414C4.206 11.0337 4.01067 10.5623 4 10V3C4.01033 2.43733 4.20567 1.966 4.586 1.586C4.96633 1.206 5.43767 1.01067 6 1Z"
                fill="#79808A"
              />
            </svg>
          </div>
        </PskInput>
      </div>
    </div>
  </FormLayout>
</template>

<style lang="scss">
.FeedEditorView {
  height: 100%;
}

.FeedEditorView__boxFields1 {
  margin: 20px 0 0 0;
}

.FeedEditorView__boxFields2 {
  display: grid;
  align-items: end;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px 30px;
}

.FeedEditorView__boxFields2H1 {
  @include setFontStyle6();
  grid-column: span 2;
  margin: 50px 0 10px 0;
}

.FeedEditorView__FormSite {
  margin: 20px 0 0 0;
}

.FeedEditorView__h1 {
  grid-column: span3;
  @include setFontStyle6();
  margin: 50px 0 30px 0;
}
</style>
