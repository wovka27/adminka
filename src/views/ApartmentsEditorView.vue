<script setup lang="ts">
import { Warning } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useGlobalSettingsStore, usePricesOptionsStore } from '@/stores'

import AggregatorsLayout, { type IAggregatorsLayoutProps } from '@/layouts/AggregatorsLayout.vue'
import FormLayout from '@/layouts/FormLayout.vue'

import ApartmentAvito from '@/components/Apartment/ApartmentAvito.vue'
import ApartmentCian from '@/components/Apartment/ApartmentCian.vue'
import ApartmentDomClick from '@/components/Apartment/ApartmentDomClick.vue'
import ApartmentYandex from '@/components/Apartment/ApartmentYandex.vue'
import DefaultFormFields from '@/components/DefaultFormFields.vue'
import ProfitDomPrices from '@/components/ProfitDomPrices.vue'

import useEditorView from '@/composables/app/useEditorView'
import useRefs from '@/composables/app/useRefs'
import useUploadImages from '@/composables/app/useUploadImages'

import type { IAggregatorItem } from '@/services/REST/dom_admin/common_types'
import {
  type IEstate,
  type IEstateGlobalSetting,
  type IEstatePrice,
  type IEstateSmartPrice,
  fetchGetEstate,
  fetchUpdateEstate
} from '@/services/REST/dom_admin/estate'

import getHandleBackArgs from '@/helpers/getHandleBackArgs'
import getNumString from '@/helpers/getNumString'

const router = useRouter()

const refs = useRefs('interior-types', 'window-views', 'window-placements', 'margin-groups')

const price_options_store = usePricesOptionsStore()
const { getGlobalSettings } = useGlobalSettingsStore()

const { images, getRequestImages, getImages } = useUploadImages()

const { apply, is_data_loaded, getIsStateBeforeEqualAfter, pushCommonData, default_fields } = useEditorView({
  router,
  fetchGetEntity: fetchGetEstate,
  back_route_name: 'apartment_list',
  default_fields: true,
  apply: {
    request_data: getRequestImages,
    update: {
      fetchUpdateEntity: fetchUpdateEstate,
      afterResponseFn: async (response) => {
        aggregators_items = response.aggregators_items?.map(getAggregatorItem) ?? []
      }
    }
  },
  setFormData: (form_data) => {
    name.value = form_data.name || ''
    status.value = form_data.status || ''
    title_for_site.value = form_data.title_for_site || ''
    article.value = form_data.article || ''
    legal_text.value = form_data.legal_text || ''
    plan_type.value = form_data.plan_type || ''
    rooms.value = getNumString(form_data.rooms)
    common_square.value = getNumString(form_data.common_square)
    living_space.value = form_data.living_space || ''
    kitchen_square.value = getNumString(form_data.kitchen_square)
    loggia_square.value = form_data.loggia_square || ''
    ceiling_height.value = form_data.ceiling_height || ''
    floor.value = getNumString(form_data.floor)
    number_on_floor.value = getNumString(form_data.number_on_floor)
    number.value = form_data.number || ''
    interior.value = form_data.interior || ''
    window_view.value = form_data.window_view || ''
    window_placement.value = form_data.window_placement || ''
    video_review.value = form_data.video_review || ''
    description.value = form_data.description || ''
    smart_prices.value = form_data.smart_prices || []
    prices.value = form_data.prices || []
    margin_group.value = form_data.margin_group || ''
    subsidy.value = !!form_data.subsidy
    installment.value = !!form_data.installment
    renovation.value = !!form_data.renovation
    marginal.value = !!form_data.marginal
    trade_in.value = !!form_data.trade_in
    is_special.value = !!form_data.is_special
    custom_squares.value = Object.entries(form_data.custom_squares).reduce(
      (acc, [key, val]) => ({
        ...acc,
        [key]: getNumString(val)
      }),
      custom_squares.value
    )
    terrace_square.value = form_data.terrace_square || ''
    is_penthouse.value = !!form_data.is_penthouse
    loggias_count.value = form_data.loggias_count || ''
    balconies_count.value = form_data.balconies_count || ''

    global_settings.value = form_data.global_settings

    getImages(form_data.images)

    getGlobalSettings(global_settings.value)
    price_options_store.getPriceAndSmartPrices(prices.value, smart_prices.value)
  },
  getRequestData: () => ({
    images: images.value,
    name: name.value,
    status: status.value,
    title_for_site: title_for_site.value,
    article: article.value,
    legal_text: legal_text.value,
    plan_type: plan_type.value,
    rooms: rooms.value && +rooms.value,
    common_square: common_square.value && +common_square.value,
    living_space: living_space.value,
    kitchen_square: kitchen_square.value && +kitchen_square.value,
    loggia_square: loggia_square.value,
    ceiling_height: ceiling_height.value,
    floor: floor.value && +floor.value,
    global_settings: global_settings.value,
    number_on_floor: number_on_floor.value && +number_on_floor.value,
    number: number.value,
    interior: interior.value,
    window_view: window_view.value,
    window_placement: window_placement.value,
    video_review: video_review.value,
    description: description.value,
    smart_prices: smart_prices.value,
    margin_group: margin_group.value,
    subsidy: subsidy.value,
    installment: installment.value,
    renovation: renovation.value,
    marginal: marginal.value,
    trade_in: trade_in.value,
    is_special: is_special.value,
    custom_squares: custom_squares.value,
    terrace_square: terrace_square.value,
    is_penthouse: is_penthouse.value,
    loggias_count: loggias_count.value && loggias_count.value,
    balconies_count: balconies_count.value && balconies_count.value
  }),
  mount: {
    common: {
      app_header_props: ([response_apartment]) => {
        const title = `${response_apartment.complex.name} / ${response_apartment.house.name} / Апартаменты №${response_apartment.number}`

        return {
          title,
          breadcrumbs: [
            { label: 'Объекты недвижимости' },
            {
              label: 'Апартаменты',
              route: getHandleBackArgs('apartment_list')
            },
            { label: title }
          ]
        }
      },
      fn: async ([response_apartment]) => {
        aggregators_items = response_apartment.aggregators_items?.length
          ? response_apartment.aggregators_items.map(getAggregatorItem)
          : []
      }
    }
  }
})

const name = ref('')
const status = ref('')
const title_for_site = ref('')
const article = ref('')
const plan_type = ref('')
const custom_squares = ref<IEstate['custom_squares']>({
  kitchen_square: '',
  living_square: '',
  loggia_square: '',
  marketing_square: ''
})
const rooms = ref('')
const common_square = ref('')
const living_space = ref('')
const kitchen_square = ref('')
const loggia_square = ref('')
const ceiling_height = ref('')
const floor = ref('')
const number_on_floor = ref('')
const number = ref('')
const global_settings = ref<IEstateGlobalSetting[]>([])
const interior = ref('')
const window_view = ref('')
const window_placement = ref('')
const video_review = ref('')
const description = ref('')
const smart_prices = ref<IEstateSmartPrice[]>([])
const prices = ref<IEstatePrice[]>([])
const legal_text = ref('')
const margin_group = ref('')
const subsidy = ref(false)
const installment = ref(false)
const renovation = ref(false)
const marginal = ref(false)
const trade_in = ref(false)
const is_special = ref(false)
const terrace_square = ref('')
const is_penthouse = ref(false)
const loggias_count = ref('')
const balconies_count = ref('')

let aggregators_items: IAggregatorsLayoutProps['aggregators'] = []

const getAggregatorItem = (aggregator: IAggregatorItem) => {
  const result = new Map([
    ['avito_real_property', { ...aggregator, component: ApartmentAvito }],
    ['cian_real_property', { ...aggregator, component: ApartmentCian }],
    ['dom_click_real_property', { ...aggregator, component: ApartmentDomClick }],
    ['yandex_real_property', { ...aggregator, component: ApartmentYandex }]
  ])
  return result.get(aggregator.type)
}
</script>

<template>
  <AggregatorsLayout
    v-if="is_data_loaded"
    :aggregators="aggregators_items"
    :getIsStateBeforeEqualAfter="getIsStateBeforeEqualAfter"
    @pushCommonData="pushCommonData"
  >
    <FormLayout :apply="apply">
      <div class="ApartmentsEditorView">
        <DefaultFormFields v-model="default_fields" is_show_dates />

        <div class="ApartmentsEditorView__boxFields1 gridForm">
          <PskInput v-model="name" style="grid-column: span 2" label="Название" disabled />
          <PskInput v-model="status" label="Статус" disabled />

          <PskInput
            v-model="title_for_site"
            style="grid-column: span 2"
            label="Название для сайта"
            placeholder="Введите название"
          />
        </div>

        <div class="ApartmentsEditorView__boxFields2 gridForm">
          <h3 class="ApartmentsEditorView__boxFields2H1">Об апартаментах</h3>

          <PskSwitch label="Является ли объект пентхаусом?" v-model="is_penthouse" />

          <div></div>
          <div></div>

          <PskInput v-model="article" label="Артикул" disabled />

          <PskInput v-model="plan_type" label="Тип планировки" disabled>
            <el-popover placement="top" trigger="hover" width="fit-content">
              <template #reference>
                <el-icon class="iconHover_default" style="font-size: 13px">
                  <Warning />
                </el-icon>
              </template>
              Забирается на все типы фидов
            </el-popover>
          </PskInput>

          <PskInput v-model="rooms" label="Кол-во комнат" disabled>
            <el-popover placement="top" trigger="hover" width="fit-content">
              <template #reference>
                <el-icon class="iconHover_default" style="font-size: 13px">
                  <Warning />
                </el-icon>
              </template>
              Забирается на все типы фидов
            </el-popover>
          </PskInput>

          <PskInput v-model="common_square" label="Площадь по декларации, м²" disabled>
            <el-popover placement="top" trigger="hover" width="fit-content">
              <template #reference>
                <el-icon class="iconHover_default" style="font-size: 13px">
                  <Warning />
                </el-icon>
              </template>
              Забирается на все типы фидов
            </el-popover>
          </PskInput>

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
          <PskInput v-model="custom_squares.living_square" label="Жилая площадь, м²" type="number" />

          <PskWYSIWYGEditor label="Лигл к маркетинговой площади" v-model="legal_text" />

          <PskInput v-model="loggias_count" label="Количество лоджий" type="number" placeholder="Введите кол-во" />
          <PskInput v-model="balconies_count" label="Количество балконов" type="number" placeholder="Введите кол-во" />

          <PskInput v-model="custom_squares.loggia_square" label="Площадь лоджии, м²" type="number">
            <el-popover placement="top" trigger="hover" width="fit-content">
              <template #reference>
                <el-icon class="iconHover_default" style="font-size: 13px">
                  <Warning />
                </el-icon>
              </template>
              Забирается на все типы фидов
            </el-popover>
          </PskInput>

          <PskInput v-model="terrace_square" label="Площадь террасы, м²" type="number" />

          <PskInput v-model="custom_squares.kitchen_square" label="Площадь кухни, м²" type="number">
            <el-popover placement="top" trigger="hover" width="fit-content">
              <template #reference>
                <el-icon class="iconHover_default" style="font-size: 13px">
                  <Warning />
                </el-icon>
              </template>
              Забирается на все типы фидов
            </el-popover>
          </PskInput>

          <PskInput v-model="ceiling_height" label="Высота потолка, м" type="number">
            <el-popover placement="top" trigger="hover" width="fit-content">
              <template #reference>
                <el-icon class="iconHover_default" style="font-size: 13px">
                  <Warning />
                </el-icon>
              </template>
              Забирается на все типы фидов
            </el-popover>
          </PskInput>

          <PskInput v-model="floor" label="Этаж" disabled>
            <el-popover placement="top" trigger="hover" width="fit-content">
              <template #reference>
                <el-icon class="iconHover_default" style="font-size: 13px">
                  <Warning />
                </el-icon>
              </template>
              Забирается на все типы фидов
            </el-popover>
          </PskInput>

          <PskInput v-model="number_on_floor" label="Номер на этаже" disabled>
            <el-popover placement="top" trigger="hover" width="fit-content">
              <template #reference>
                <el-icon class="iconHover_default" style="font-size: 13px">
                  <Warning />
                </el-icon>
              </template>
              Забирается на все типы фидов
            </el-popover>
          </PskInput>

          <PskInput v-model="number" label="Номер квартиры" disabled>
            <el-popover placement="top" trigger="hover" width="fit-content">
              <template #reference>
                <el-icon class="iconHover_default" style="font-size: 13px">
                  <Warning />
                </el-icon>
              </template>
              Забирается на все типы фидов
            </el-popover>
          </PskInput>

          <PskSelect
            v-model="interior"
            :options="refs.interior_types"
            label="Отделка"
            placeholder="Выберите вид отделки"
            clearable
          />

          <PskSelect
            v-model="window_view"
            :options="refs.window_views"
            label="Вид из окна"
            placeholder="Выберите вид из окна"
            clearable
          />

          <PskSelect
            v-model="window_placement"
            :options="refs.window_placements"
            label="Положение окон"
            placeholder="Выберите положение окон"
            clearable
          />

          <PskInput
            v-model="video_review"
            label="Видеообзор"
            style="grid-column: span 3"
            placeholder="Введите/вставьте ссылку"
          />

          <PskWYSIWYGEditor v-model="description" label="Описание" style="grid-column: span 3" />
        </div>

        <UploadImg class="ApartmentsEditorView__UploadImg" v-model="images" :limit="10" />

        <ProfitDomPrices v-model="smart_prices" />

        <div v-if="prices?.length" class="ApartmentsEditorView__boxFields3 gridForm">
          <h1 class="ApartmentsEditorView__boxFields3H1">Цены 1C</h1>
          <PskInput
            v-model="price_item.cost"
            :label="price_item.price_type + ', ₽'"
            disabled
            v-for="price_item of prices"
            :key="price_item.price_type_uid"
            type="cash"
          >
            <el-popover placement="top" trigger="hover" width="fit-content">
              <template #reference>
                <el-icon class="iconHover_default" style="font-size: 13px">
                  <Warning />
                </el-icon>
              </template>
              Забирается в зависимости от настроек
            </el-popover>
          </PskInput>
        </div>

        <div class="ApartmentsEditorView__boxFields4 gridForm">
          <h1 class="ApartmentsEditorView__boxFields4H1">Прочее</h1>
          <PskSelect
            v-model="margin_group"
            :options="refs.margin_groups"
            options_label="label"
            options_value="value"
            label="Группа маржинальности"
          />

          <div></div>
          <div></div>

          <div class="ApartmentsEditorView__switchList">
            <PskSwitch v-model="subsidy" label="Субсидия" />
            <PskSwitch v-model="installment" label="Рассрочка" />
            <PskSwitch v-model="renovation" label="Ремонт" />
            <PskSwitch v-model="marginal" label="Маржинальная" />
            <PskSwitch v-model="trade_in" label="Trade-in" />
            <PskSwitch v-model="is_special" label="Особенный" />
          </div>
        </div>
      </div>
    </FormLayout>
  </AggregatorsLayout>
</template>

<style lang="scss">
.ApartmentsEditorView {
  height: 100%;
}

.ApartmentsEditorView__boxFields1 {
  margin: 20px 0 0 0;
}

.ApartmentsEditorView__boxFields2H1,
.ApartmentsEditorView__boxFields3H1,
.ApartmentsEditorView__boxFields4H1 {
  @include setFontStyle6();

  margin: 50px 0 10px 0;
  grid-column: span 3;
}

.ApartmentsEditorView__UploadImg {
  margin: 30px 0 50px 0;
}

.ApartmentsEditorView__switchList {
  grid-column: span 3;

  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>
