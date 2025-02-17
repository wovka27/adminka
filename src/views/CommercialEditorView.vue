<script setup lang="ts">
import { Warning } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { usePricesOptionsStore } from '@/stores'

import AggregatorsLayout from '@/layouts/AggregatorsLayout.vue'
import FormLayout from '@/layouts/FormLayout.vue'

import CommercialAvito from '@/components/Commercial/CommercialAvito.vue'
import CommercialCian from '@/components/Commercial/CommercialCian.vue'
import CommercialDomClick from '@/components/Commercial/CommercialDomClick.vue'
import CommercialEtagi from '@/components/Commercial/CommercialEtagi.vue'
import CommercialIdalite from '@/components/Commercial/CommercialIdalite.vue'
import CommercialM2 from '@/components/Commercial/CommercialM2.vue'
import CommercialYandex from '@/components/Commercial/CommercialYandex.vue'
import DefaultFormFields from '@/components/DefaultFormFields.vue'
import ProfitDomPrices from '@/components/ProfitDomPrices/ProfitDomPrices.vue'

import useEditorView from '@/composables/app/useEditorView'
import useRefs from '@/composables/app/useRefs'
import useUploadImages from '@/composables/app/useUploadImages'

import {
  type IEstate,
  type IEstatePrice,
  type IEstateSmartPrice,
  fetchGetEstate,
  fetchUpdateEstate
} from '@/services/REST/dom_admin/estate'

import { AggregatorItem } from '@/helpers/AggregatorItem'
import getHandleBackArgs from '@/helpers/getHandleBackArgs'
import getNumString from '@/helpers/getNumString'

const router = useRouter()
const refs = useRefs('interior-types', 'window-views', 'window-placements', 'margin-groups')
const price_options_store = usePricesOptionsStore()
const { images, getRequestImages, getImages } = useUploadImages()
const { is_data_loaded, apply, pushCommonData, getIsStateBeforeEqualAfter, default_fields } = useEditorView({
  router,
  back_route_name: 'commercial_list',
  fetchGetEntity: fetchGetEstate,
  default_fields: true,
  apply: {
    request_data: getRequestImages,
    update: {
      fetchUpdateEntity: fetchUpdateEstate,
      afterResponseFn: async (response) => commercial.getAggregatorsItems(response)
    }
  },
  setFormData: (form_data) => {
    getImages(form_data.images)
    name.value = form_data.name || ''
    status.value = form_data.status || ''
    title_for_site.value = form_data.title_for_site || ''
    article.value = form_data.article || ''
    plan_type.value = form_data.plan_type || ''
    rooms.value = getNumString(form_data.rooms)
    common_square.value = getNumString(form_data.common_square)
    living_space.value = getNumString(form_data.living_space)
    kitchen_square.value = getNumString(form_data.kitchen_square)
    loggia_square.value = getNumString(form_data.loggia_square)
    ceiling_height.value = getNumString(form_data.ceiling_height)
    floor.value = getNumString(form_data.floor)
    number_on_floor.value = getNumString(form_data.number_on_floor)
    number.value = form_data.number || ''
    interior.value = form_data.interior || ''
    window_view.value = form_data.window_view || ''
    window_placement.value = form_data.window_placement || ''
    video_review.value = form_data.video_review || ''
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

    price_options_store.getPriceAndSmartPrices(prices.value, smart_prices.value)
  },
  getRequestData: () => ({
    images: images.value,
    name: name.value,
    status: status.value,
    title_for_site: title_for_site.value,
    article: article.value,
    plan_type: plan_type.value,
    rooms: rooms.value && +rooms.value,
    common_square: common_square.value && +common_square.value,
    living_space: living_space.value && +living_space.value,
    kitchen_square: kitchen_square.value && +kitchen_square.value,
    loggia_square: loggia_square.value && +loggia_square.value,
    ceiling_height: ceiling_height.value && +ceiling_height.value,
    floor: floor.value && +floor.value,
    number_on_floor: number_on_floor.value && +number_on_floor.value,
    custom_squares: custom_squares.value,
    number: number.value,
    interior: interior.value,
    window_view: window_view.value,
    window_placement: window_placement.value,
    video_review: video_review.value,
    smart_prices: smart_prices.value,
    margin_group: margin_group.value,
    subsidy: subsidy.value,
    installment: installment.value,
    renovation: renovation.value,
    marginal: marginal.value,
    trade_in: trade_in.value,
    is_special: is_special.value
  }),
  mount: {
    common: {
      app_header_props: ([response_commercial]) => ({
        title: `${response_commercial.complex.name} / ${response_commercial.house.name} / Коммерция №${response_commercial.number}`,
        breadcrumbs: [
          { label: 'Объекты недвижимости' },
          {
            label: 'Коммерция',
            route: getHandleBackArgs('commercial_list')
          },
          {
            label: `${response_commercial.complex.name} / ${response_commercial.house.name} / Коммерция №${response_commercial.number}`
          }
        ]
      }),
      fn: async ([response_commercial]) => commercial.getAggregatorsItems(response_commercial)
    }
  }
})

const name = ref('')
const status = ref('')
const title_for_site = ref('')
const custom_squares = ref<IEstate['custom_squares']>({
  kitchen_square: '',
  living_square: '',
  loggia_square: '',
  marketing_square: ''
})
const article = ref('')
const plan_type = ref('')
const rooms = ref('')
const common_square = ref('')
const living_space = ref('')
const kitchen_square = ref('')
const loggia_square = ref('')
const ceiling_height = ref('')
const floor = ref('')
const number_on_floor = ref('')
const number = ref('')
const interior = ref('')
const window_view = ref('')
const window_placement = ref('')
const video_review = ref('')
const smart_prices = ref<IEstateSmartPrice[]>([])
const prices = ref<IEstatePrice[]>([])
const margin_group = ref('')
const subsidy = ref(false)
const installment = ref(false)
const renovation = ref(false)
const marginal = ref(false)
const trade_in = ref(false)
const is_special = ref(false)

const commercial = new AggregatorItem('commercial', [
  CommercialAvito,
  CommercialCian,
  CommercialDomClick,
  CommercialYandex,
  CommercialM2,
  CommercialIdalite,
  CommercialEtagi
])
</script>

<template>
  <AggregatorsLayout
    v-if="is_data_loaded"
    :aggregators="commercial.aggregators_items"
    :getIsStateBeforeEqualAfter="getIsStateBeforeEqualAfter"
    @pushCommonData="pushCommonData"
  >
    <FormLayout :apply="apply">
      <PskGridContainer grid-column-count="3">
        <DefaultFormFields v-model="default_fields" is_show_dates />
        <PskInput v-model="name" label="Название" disabled class="span-2" />
        <PskInput v-model="status" label="Статус" disabled />
        <PskInput v-model="title_for_site" label="Название для сайта" placeholder="Введите название" class="span-2" />

        <PskGridContainer grid-column-count="3" grid-span="3" title="О квартире">
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
          <PskInput v-model="common_square" label="Площадь, м²" disabled>
            <el-popover placement="top" trigger="hover" width="fit-content">
              <template #reference>
                <el-icon class="iconHover_default" style="font-size: 13px">
                  <Warning />
                </el-icon>
              </template>
              Забирается на все типы фидов
            </el-popover>
          </PskInput>
          <PskInput v-model="ceiling_height" label="Высота потолка, м">
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

          <PskInput v-model="number" label="Номер подвала" disabled>
            <el-popover placement="top" trigger="hover" width="fit-content">
              <template #reference>
                <el-icon class="iconHover_default" style="font-size: 13px">
                  <Warning />
                </el-icon>
              </template>
              Забирается на все типы фидов
            </el-popover>
          </PskInput>

          <div></div>
          <div></div>

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

          <PskInput v-model="video_review" label="Видеообзор" class="span-3" placeholder="Введите/вставьте ссылку" />
        </PskGridContainer>

        <UploadImg class="CommercialEditorView__UploadImg" v-model="images" :limit="10" />
        <ProfitDomPrices v-model="smart_prices" />

        <PskGridContainer v-if="prices.length" grid-span="3" grid-column-count="3" title="Цены 1C">
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
        </PskGridContainer>

        <PskGridContainer grid-column-count="3" grid-span="3" title="Прочее">
          <PskSelect
            v-model="margin_group"
            :options="refs.margin_groups"
            options_label="label"
            options_value="value"
            label="Группа маржинальности"
          />
          <div></div>
          <div></div>
          <div class="CommercialEditorView__switchList">
            <PskSwitch v-model="subsidy" label="Субсидия" />
            <PskSwitch v-model="installment" label="Рассрочка" />
            <PskSwitch v-model="renovation" label="Ремонт" />
            <PskSwitch v-model="marginal" label="Маржинальная" />
            <PskSwitch v-model="trade_in" label="Trade-in" />
            <PskSwitch v-model="is_special" label="Особенный" />
          </div>
        </PskGridContainer>
      </PskGridContainer>
    </FormLayout>
  </AggregatorsLayout>
</template>

<style lang="scss">
.CommercialEditorView__switchList {
  grid-column: span 3;
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>
