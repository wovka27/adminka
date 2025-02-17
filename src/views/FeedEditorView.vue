<script setup lang="ts">
import { Warning } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import FormLayout from '@/layouts/FormLayout.vue'

import DefaultFormFields from '@/components/DefaultFormFields.vue'
import FeedCollapseTable from '@/components/FeedCollapseTable.vue'

import useEditorView from '@/composables/app/useEditorView'
import useRefs from '@/composables/app/useRefs'

import {
  type IFeed,
  type IForcedFlats,
  fetchCreateFeed,
  fetchGetFeed,
  fetchGetForcedFlatsFeed,
  fetchUpdateFeed
} from '@/services/REST/dom_admin/feed'

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
      fn: async () => {
        if (router.currentRoute.value.params.uid === 'create') return

        const data = await fetchGetForcedFlatsFeed(router.currentRoute.value.params.uid as string)

        if (data) {
          forced_flats_list.value = data
        }
      },
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

const forced_flats_list = ref<IForcedFlats>({
  override_global_price_flats: [],
  force_load_flats: []
})

const alertText: Record<IFeed['settings_type'], string> = {
  PERSONAL:
    'Для этого фида параметры выгрузки квартир управляются в Квартирах полями: "Статус выгрузки", "Какой тип цены выгружать", "Какой тип площади выгружать"',
  GLOBAL:
    'Для этого фида игнорируются принудительные настройки выгрузки. Выборка производится по автоматической настройке'
}

const feed_type_list: { value: AggregatorItemType; label: string }[] = [
  { value: 'cian', label: 'Циан' },
  { value: 'avito', label: 'Авито' },
  { value: 'yandex', label: 'Яндекс.Недвижимость' },
  { value: 'm2', label: 'M2' },
  { value: 'dom_click', label: 'ДомКлик' },
  { value: 'idalite', label: 'Идалайт' },
  { value: 'etagi', label: 'Этажи' }
]
</script>

<template>
  <FormLayout v-if="is_data_loaded" :apply="apply">
    <PskGridContainer grid-column-count="3">
      <DefaultFormFields v-model="default_fields" is_show_dates />

      <PskInput v-model="name" label="Название" required placeholder="Введите название" class="span-2" />
      <PskSelect
        label="Тип фида"
        v-model="type"
        :options="feed_type_list"
        required
        options_label="label"
        options_value="value"
        :disabled="$route.params.uid !== 'create'"
      />

      <PskGridContainer grid-column-count="2" grid-span="3" title="Настройки">
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
        <FeedCollapseTable
          title="Список квартир с выгружаемой ценой"
          :data_list="forced_flats_list.override_global_price_flats"
          name_key="override_global_price"
        />
        <FeedCollapseTable
          title="Список принудительно загруженных квартир"
          :data_list="forced_flats_list.force_load_flats"
          name_key="force_load"
        />
        <PskCopiedInput v-model="file_url" class="span-2" label="Ссылка на фид" v-if="file_url" />
      </PskGridContainer>
    </PskGridContainer>
  </FormLayout>
</template>
